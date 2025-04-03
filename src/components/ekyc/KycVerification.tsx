
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Upload, Shield, X, Eye, Camera, Edit, AlertCircle, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { addKycVerification, getKycVerificationByUserId } from '@/data/kycVerificationsData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createWorker } from 'tesseract.js';

export interface KycVerificationProps {
  userId: string;
  onComplete?: () => void;
  formData?: {
    fullName: string;
    dob: string;
    nationality: string;
    idType: "passport" | "national_id" | "driving_license";
    idNumber: string;
    address: string;
    phone: string;
    email: string;
  };
}

const KycVerification = ({ userId, onComplete, formData }: KycVerificationProps) => {
  const [activeTab, setActiveTab] = useState("id");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<"idFront" | "idBack" | "selfie" | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureType, setCaptureType] = useState<"idFront" | "idBack" | "selfie" | null>(null);
  const [extractedData, setExtractedData] = useState<{
    idNumber?: string;
    name?: string;
    dob?: string;
    address?: string;
    gender?: string;
  }>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedIdNumber, setEditedIdNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Tesseract.Worker | null>(null);

  // Initialize Tesseract worker
  useEffect(() => {
    const initWorker = async () => {
      const worker = await createWorker('eng');
      workerRef.current = worker;
    };

    initWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    // Only check for existing verification when component mounts
    const checkExistingVerification = () => {
      const existingVerification = getKycVerificationByUserId(userId);
      // Only set as complete if there's an approved verification
      if (existingVerification && existingVerification.status === 'approved') {
        setIsComplete(true);
      }
    };
    
    checkExistingVerification();
  }, [userId]);

  useEffect(() => {
    // If ID front is set, process it for OCR extraction
    if (idFront && formData) {
      extractDataFromAadhaar(idFront);
    }
  }, [idFront, formData]);

  const extractDataFromAadhaar = async (idImage: File) => {
    if (!workerRef.current) {
      toast({
        title: "OCR Not Ready",
        description: "Please wait for the OCR system to initialize.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "Processing Aadhaar Card",
        description: "We're extracting information from your ID. This may take a moment..."
      });

      // Create an image URL for the file
      const imageUrl = URL.createObjectURL(idImage);
      
      // Perform OCR on the image
      const result = await workerRef.current.recognize(imageUrl);
      
      // Clean up the URL
      URL.revokeObjectURL(imageUrl);
      
      // Process the OCR text
      const ocrText = result.data.text;
      console.log('OCR extracted text:', ocrText);
      
      // Extract Aadhaar number using regex pattern (12 digits, may be space-separated)
      const aadhaarRegex = /\b(\d{4}\s?\d{4}\s?\d{4})\b/;
      const aadhaarMatch = ocrText.match(aadhaarRegex);
      
      // Create object to store extracted data
      const extracted: {
        idNumber?: string;
        name?: string;
        dob?: string;
        address?: string;
        gender?: string;
      } = {};
      
      // If we found an Aadhaar number
      if (aadhaarMatch) {
        // Remove spaces from Aadhaar number
        const aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
        extracted.idNumber = aadhaarNumber;
        
        // Look for DOB pattern (DD/MM/YYYY)
        const dobRegex = /\b(\d{2}\/\d{2}\/\d{4})\b/;
        const dobMatch = ocrText.match(dobRegex);
        if (dobMatch) {
          extracted.dob = dobMatch[1];
        }
        
        // Look for name - typically appears with "Name:" or after "To,"
        // This is a simplified approach, a more robust solution would use NER
        const nameLines = ocrText.split('\n').filter(line => 
          line.includes('Name:') || 
          (line.length > 10 && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line))
        );
        
        if (nameLines.length > 0) {
          const nameLine = nameLines[0];
          if (nameLine.includes('Name:')) {
            extracted.name = nameLine.split('Name:')[1].trim();
          } else {
            // Just take the first capitalized words as the name
            extracted.name = nameLine.trim();
          }
        }
        
        // Extract gender if present
        if (ocrText.includes('MALE') || ocrText.includes('Male')) {
          extracted.gender = 'Male';
        } else if (ocrText.includes('FEMALE') || ocrText.includes('Female')) {
          extracted.gender = 'Female';
        }
        
        // Extract address - usually multi-line and after "Address:"
        // This is simplified; a more robust solution would use NER or layout analysis
        const addressIndex = ocrText.indexOf('Address:');
        if (addressIndex > -1) {
          const addressText = ocrText.substring(addressIndex + 8);
          const endOfAddress = addressText.indexOf('\n\n');
          if (endOfAddress > -1) {
            extracted.address = addressText.substring(0, endOfAddress).trim();
          } else {
            extracted.address = addressText.substring(0, 100).trim(); // Take first 100 chars
          }
        }
        
        // Set the extracted data
        setExtractedData(extracted);
        
        // If extracted ID is different from form data, show edit dialog
        if (extracted.idNumber && extracted.idNumber !== formData?.idNumber) {
          setEditedIdNumber(extracted.idNumber);
          setIsEditDialogOpen(true);
        }
        
        toast({
          title: "Data Extracted",
          description: "We've successfully extracted information from your Aadhaar card."
        });
      } else {
        toast({
          title: "Extraction Issue",
          description: "We couldn't identify an Aadhaar number. Please ensure the image is clear and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('OCR extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: "We encountered an error while processing your ID. Please try again with a clearer image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIdFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFront(e.target.files[0]);
    }
  };

  const handleIdBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdBack(e.target.files[0]);
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelfie(e.target.files[0]);
    }
  };

  const handlePreview = (type: "idFront" | "idBack" | "selfie") => {
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  const handleCameraOpen = (type: "idFront" | "idBack" | "selfie") => {
    setCaptureType(type);
    setIsCameraOpen(true);
    
    // Start camera when dialog opens
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: captureType === "selfie" ? "user" : "environment" } 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create File object from blob
            const file = new File([blob], `${captureType}-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Set the appropriate file based on capture type
            if (captureType === 'idFront') setIdFront(file);
            else if (captureType === 'idBack') setIdBack(file);
            else if (captureType === 'selfie') setSelfie(file);
            
            toast({
              title: "Photo Captured",
              description: `${captureType === 'idFront' ? 'ID Front' : captureType === 'idBack' ? 'ID Back' : 'Selfie'} captured successfully.`
            });
          }
        }, 'image/jpeg', 0.95);
      }
      
      // Close camera after capture
      setIsCameraOpen(false);
      stopCamera();
    }
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    stopCamera();
  };

  const handleSubmit = () => {
    // Ensure all required documents are uploaded
    if (!idFront || !idBack || !selfie) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents (ID Front, ID Back, and Selfie).",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate submitting verification documents
    setIsSubmitting(true);
    
    setTimeout(() => {
      // In a real application, we would upload these files to storage
      // and save the URLs in the database
      
      // Add verification to our shared data store
      if (formData) {
        addKycVerification({
          userId,
          name: formData.fullName,
          email: formData.email,
          // Create object URLs for demo purposes
          document: idFront ? URL.createObjectURL(idFront) : '',
          photo: selfie ? URL.createObjectURL(selfie) : '',
          status: 'pending',
          submissionDate: new Date().toISOString()
        });
      }
      
      setIsSubmitting(false);
      setIsComplete(true);
      
      toast({
        title: "Verification Submitted",
        description: "Your identity verification has been submitted successfully.",
      });
      
      // Call onComplete if provided
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  const handleEditIdNumber = () => {
    // Update formData with corrected ID number
    if (formData) {
      // In a real app, you would update the formData here
      toast({
        title: "ID Number Updated",
        description: `ID Number has been corrected to: ${editedIdNumber}`
      });
    }
    setIsEditDialogOpen(false);
  };
  
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Document Verification</CardTitle>
      </CardHeader>
      
      <CardContent>
        {!isComplete ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="id">ID Front</TabsTrigger>
              <TabsTrigger value="idBack">ID Back</TabsTrigger>
              <TabsTrigger value="selfie">Selfie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="id" className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="id-front">Upload or Capture Front of Aadhaar Card</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="id-front"
                    className="hidden"
                    accept="image/*"
                    onChange={handleIdFrontChange}
                  />
                  <Button asChild variant="outline" className="flex-1">
                    <Label htmlFor="id-front" className="cursor-pointer">
                      {idFront ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {idFront.name}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload ID Front
                        </>
                      )}
                    </Label>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCameraOpen("idFront")}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture ID Front
                  </Button>
                </div>
                {idFront && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(idFront)}
                      alt="ID Front Preview"
                      className="mt-2 rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white" 
                      onClick={() => handlePreview("idFront")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                        <div className="text-center text-white">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Extracting data...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Extracted data section */}
                {Object.keys(extractedData).length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Extracted Information
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditedIdNumber(extractedData.idNumber || "");
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {extractedData.idNumber && (
                        <p><span className="font-semibold">Aadhaar Number:</span> {extractedData.idNumber}</p>
                      )}
                      {extractedData.name && (
                        <p><span className="font-semibold">Name:</span> {extractedData.name}</p>
                      )}
                      {extractedData.dob && (
                        <p><span className="font-semibold">Date of Birth:</span> {extractedData.dob}</p>
                      )}
                      {extractedData.gender && (
                        <p><span className="font-semibold">Gender:</span> {extractedData.gender}</p>
                      )}
                      {extractedData.address && (
                        <p><span className="font-semibold">Address:</span> {extractedData.address}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="idBack" className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="id-back">Upload or Capture Back of Aadhaar Card</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="id-back"
                    className="hidden"
                    accept="image/*"
                    onChange={handleIdBackChange}
                  />
                  <Button asChild variant="outline" className="flex-1">
                    <Label htmlFor="id-back" className="cursor-pointer">
                      {idBack ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {idBack.name}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload ID Back
                        </>
                      )}
                    </Label>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCameraOpen("idBack")}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture ID Back
                  </Button>
                </div>
                {idBack && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(idBack)}
                      alt="ID Back Preview"
                      className="mt-2 rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white" 
                      onClick={() => handlePreview("idBack")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="selfie" className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="selfie">Upload or Capture Selfie</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="selfie"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSelfieChange}
                  />
                  <Button asChild variant="outline" className="flex-1">
                    <Label htmlFor="selfie" className="cursor-pointer">
                      {selfie ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {selfie.name}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Selfie
                        </>
                      )}
                    </Label>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCameraOpen("selfie")}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Selfie
                  </Button>
                </div>
                {selfie && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selfie)}
                      alt="Selfie Preview"
                      className="mt-2 rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white" 
                      onClick={() => handlePreview("selfie")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold mt-4">Verification Complete!</h3>
            <p className="text-gray-500 mt-2">
              Your documents have been successfully submitted for verification.
            </p>
          </div>
        )}

        {formData && !isComplete && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Full Name</Label>
                <p className="font-medium">{formData.fullName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Date of Birth</Label>
                <p className="font-medium">{formData.dob}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Nationality</Label>
                <p className="font-medium">{formData.nationality}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">ID Type</Label>
                <p className="font-medium">{formData.idType.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">ID Number</Label>
                <p className="font-medium">{formData.idNumber}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Phone</Label>
                <p className="font-medium">{formData.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Address</Label>
                <p className="font-medium">{formData.address}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!isComplete ? (
          <Button onClick={handleSubmit} disabled={isSubmitting || !idFront || !idBack || !selfie}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </Button>
        ) : (
          <Button onClick={onComplete || (() => {})}>
            Done
          </Button>
        )}
      </CardFooter>

      {/* Camera Sheet for capturing photos */}
      <Sheet open={isCameraOpen} onOpenChange={(open) => {
        if (!open) handleCameraClose();
      }}>
        <SheetContent className="w-full sm:max-w-full flex flex-col">
          <SheetHeader>
            <SheetTitle>
              Capture {captureType === "idFront" ? "Aadhaar Front" : 
                     captureType === "idBack" ? "Aadhaar Back" : "Selfie"}
            </SheetTitle>
            <SheetDescription>
              Position your {captureType === "selfie" ? "face" : "document"} within the frame and take a photo
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-grow flex flex-col items-center justify-center my-6 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full max-h-[60vh] object-cover rounded-lg bg-black"
            />
            
            {/* Overlay guide for document positioning */}
            {captureType !== "selfie" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-dashed border-white w-4/5 h-3/5 rounded-md opacity-70"></div>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleCameraClose}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={capturePhoto}
            >
              Capture
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Fullscreen preview sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="w-full sm:max-w-full">
          <SheetHeader>
            <SheetTitle>
              {previewType === "idFront" ? "Aadhaar Front" : 
               previewType === "idBack" ? "Aadhaar Back" : "Selfie"} Preview
            </SheetTitle>
            <SheetDescription>
              View your uploaded document in full size
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex justify-center">
            {previewType === "idFront" && idFront && (
              <img 
                src={URL.createObjectURL(idFront)} 
                alt="ID Front" 
                className="max-h-[80vh] object-contain"
              />
            )}
            {previewType === "idBack" && idBack && (
              <img 
                src={URL.createObjectURL(idBack)} 
                alt="ID Back" 
                className="max-h-[80vh] object-contain"
              />
            )}
            {previewType === "selfie" && selfie && (
              <img 
                src={URL.createObjectURL(selfie)} 
                alt="Selfie" 
                className="max-h-[80vh] object-contain"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit extracted data dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Extracted Aadhaar Number</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Please verify the extracted Aadhaar number and make corrections if needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">Aadhaar Number</Label>
              <Input
                id="idNumber"
                value={editedIdNumber}
                onChange={(e) => setEditedIdNumber(e.target.value)}
                maxLength={12}
                pattern="\d*"
                inputMode="numeric"
                placeholder="12-digit Aadhaar number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditIdNumber}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default KycVerification;
