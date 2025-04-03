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
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isEditDobDialogOpen, setIsEditDobDialogOpen] = useState(false);
  const [editedDob, setEditedDob] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Tesseract.Worker | null>(null);

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
    const checkExistingVerification = () => {
      const existingVerification = getKycVerificationByUserId(userId);
      if (existingVerification && existingVerification.status === 'approved') {
        setIsComplete(true);
      }
    };
    
    checkExistingVerification();
  }, [userId]);

  useEffect(() => {
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

      const imageUrl = URL.createObjectURL(idImage);
      
      const result = await workerRef.current.recognize(imageUrl);
      
      URL.revokeObjectURL(imageUrl);
      
      const ocrText = result.data.text;
      console.log('OCR extracted text:', ocrText);
      
      const aadhaarRegex = /\b(\d{4}\s?\d{4}\s?\d{4})\b/;
      const aadhaarMatch = ocrText.match(aadhaarRegex);
      
      const extracted: {
        idNumber?: string;
        name?: string;
        dob?: string;
        address?: string;
        gender?: string;
      } = {};
      
      if (aadhaarMatch) {
        const aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
        extracted.idNumber = aadhaarNumber;
        
        const dobRegex = /\b(\d{2}\/\d{2}\/\d{4})\b/;
        const dobMatch = ocrText.match(dobRegex);
        
        if (!dobMatch) {
          const altDobRegex = /\b(\d{4}-\d{2}-\d{2})\b/;
          const altDobMatch = ocrText.match(altDobRegex);
          
          if (altDobMatch) {
            const parts = altDobMatch[1].split('-');
            if (parts.length === 3) {
              extracted.dob = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
          } else {
            const dashDobRegex = /\b(\d{2}-\d{2}-\d{4})\b/;
            const dashDobMatch = ocrText.match(dashDobRegex);
            
            if (dashDobMatch) {
              extracted.dob = dashDobMatch[1].replace(/-/g, '/');
            }
          }
        } else {
          extracted.dob = dobMatch[1];
        }
        
        const lines = ocrText.split('\n');
        
        let nameLines = lines.filter(line => 
          line.includes('Name:') || 
          line.includes('NAME:') || 
          line.includes('Name :') || 
          line.includes('NAME :') ||
          line.includes('नाम:') ||
          line.includes('नाम :')
        );
        
        if (nameLines.length > 0) {
          const nameLine = nameLines[0];
          if (nameLine.includes(':')) {
            extracted.name = nameLine.split(':')[1].trim();
          }
        } else {
          const dobLineIndex = lines.findIndex(line => 
            line.includes('DOB') || 
            line.includes('Date of Birth') || 
            line.includes('जन्म तिथि')
          );
          
          if (dobLineIndex > 0 && dobLineIndex < lines.length - 1) {
            const potentialNameLine = lines[dobLineIndex - 1].trim();
            
            if (potentialNameLine.length > 3 && 
                !/\d/.test(potentialNameLine) && 
                !potentialNameLine.includes('Aadhaar') &&
                !potentialNameLine.includes('Government') &&
                !potentialNameLine.includes('India')) {
              extracted.name = potentialNameLine;
            }
          }
        }
        
        const allCapsNameRegex = /\b[A-Z]{2,}(?:\s+[A-Z]{2,}){1,3}\b/;
        const allCapsMatches = ocrText.match(allCapsNameRegex);
        
        if (allCapsMatches && allCapsMatches[0]) {
          extracted.name = allCapsMatches[0];
        }
        
        if (ocrText.includes('MALE') || ocrText.includes('Male')) {
          extracted.gender = 'Male';
        } else if (ocrText.includes('FEMALE') || ocrText.includes('Female')) {
          extracted.gender = 'Female';
        }
        
        const addressIndex = ocrText.indexOf('Address:');
        if (addressIndex > -1) {
          const addressText = ocrText.substring(addressIndex + 8);
          const endOfAddress = addressText.indexOf('\n\n');
          if (endOfAddress > -1) {
            extracted.address = addressText.substring(0, endOfAddress).trim();
          } else {
            extracted.address = addressText.substring(0, 100).trim();
          }
        }
        
        setExtractedData(extracted);
        
        if (extracted.idNumber && extracted.idNumber !== formData?.idNumber) {
          setEditedIdNumber(extracted.idNumber);
          setIsEditDialogOpen(true);
        }
        
        if (extracted.name && extracted.name !== formData?.fullName) {
          setEditedName(extracted.name);
          setTimeout(() => {
            setIsEditNameDialogOpen(true);
          }, 500);
        }
        
        if (extracted.dob && extracted.dob !== formData?.dob) {
          setEditedDob(extracted.dob);
          setTimeout(() => {
            setIsEditDobDialogOpen(true);
          }, 1000);
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
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${captureType}-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
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
      
      setIsCameraOpen(false);
      stopCamera();
    }
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    stopCamera();
  };

  const handleSubmit = () => {
    if (!idFront || !idBack || !selfie) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents (ID Front, ID Back, and Selfie).",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (formData) {
        addKycVerification({
          userId,
          name: formData.fullName,
          email: formData.email,
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
      
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  const handleEditIdNumber = () => {
    if (formData) {
      toast({
        title: "ID Number Updated",
        description: `ID Number has been corrected to: ${editedIdNumber}`
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleEditName = () => {
    if (formData) {
      toast({
        title: "Name Updated",
        description: `Name has been corrected to: ${editedName}`
      });
    }
    setIsEditNameDialogOpen(false);
  };

  const handleEditDob = () => {
    if (formData) {
      toast({
        title: "Date of Birth Updated",
        description: `Date of Birth has been corrected to: ${editedDob}`
      });
    }
    setIsEditDobDialogOpen(false);
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
                          setEditedName(extractedData.name || "");
                          setEditedDob(extractedData.dob || "");
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

      <Dialog open={isEditNameDialogOpen} onOpenChange={setIsEditNameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Extracted Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Please verify the extracted name and make corrections if needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Full name as on Aadhaar"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditName}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDobDialogOpen} onOpenChange={setIsEditDobDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Extracted Date of Birth</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Please verify the extracted date of birth and make corrections if needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth (DD/MM/YYYY)</Label>
              <Input
                id="dob"
                value={editedDob}
                onChange={(e) => setEditedDob(e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDobDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDob}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default KycVerification;
