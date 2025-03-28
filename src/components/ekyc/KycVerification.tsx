
import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Define the form schema to match KycForm
const formSchema = z.object({
  fullName: z.string(),
  dob: z.string(),
  nationality: z.string(),
  idType: z.enum(['passport', 'national_id', 'driving_license']),
  idNumber: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type KycVerificationProps = {
  formData: FormValues;
  onComplete: () => void;
};

const KycVerification = ({ formData, onComplete }: KycVerificationProps) => {
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [captureType, setCaptureType] = useState<'selfie' | 'idFront' | 'idBack' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  const openCamera = (type: 'selfie' | 'idFront' | 'idBack') => {
    setCaptureType(type);
    setShowCamera(true);
    setCapturedImage(null);
    
    // Start camera
    setTimeout(() => {
      startCamera();
    }, 100);
  };
  
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const constraints = {
          video: {
            facingMode: isMobile ? 'environment' : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
    
    setShowCamera(false);
  };
  
  const switchCamera = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      
      try {
        const constraints = {
          video: {
            facingMode: isMobile ? (captureType === 'selfie' ? 'user' : 'environment') : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = newStream;
      } catch (err) {
        console.error("Error switching camera:", err);
        toast({
          title: "Camera Error",
          description: "Unable to switch cameras. Please check your permissions.",
          variant: "destructive",
        });
      }
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Update state based on capture type
        if (captureType === 'selfie') {
          setSelfieUploaded(true);
          toast({
            title: "Selfie captured",
            description: "Your selfie was successfully captured.",
          });
        } else if (captureType === 'idFront') {
          setIdFrontUploaded(true);
          toast({
            title: "ID Front captured",
            description: "Front of your ID was successfully captured.",
          });
        } else if (captureType === 'idBack') {
          setIdBackUploaded(true);
          toast({
            title: "ID Back captured",
            description: "Back of your ID was successfully captured.",
          });
        }
        
        stopCamera();
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idFront' | 'idBack' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate upload
    setTimeout(() => {
      switch (type) {
        case 'idFront':
          setIdFrontUploaded(true);
          toast({
            title: "Front side uploaded",
            description: "Your ID front side was successfully uploaded.",
          });
          break;
        case 'idBack':
          setIdBackUploaded(true);
          toast({
            title: "Back side uploaded",
            description: "Your ID back side was successfully uploaded.",
          });
          break;
        case 'selfie':
          setSelfieUploaded(true);
          toast({
            title: "Selfie uploaded",
            description: "Your selfie was successfully uploaded.",
          });
          break;
      }
    }, 1000);
  };

  const startVerification = () => {
    if (!idFrontUploaded || !idBackUploaded || !selfieUploaded) {
      toast({
        title: "Incomplete uploads",
        description: "Please upload all required documents before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification process
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            toast({
              title: "Verification Complete",
              description: "Your identity has been successfully verified.",
            });
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const CameraDialog = () => (
    <Dialog open={showCamera} onOpenChange={(open) => !open && stopCamera()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="p-4 bg-shield-light">
          <h3 className="text-lg font-medium text-center">
            {captureType === 'selfie' 
              ? "Take a clear selfie" 
              : captureType === 'idFront'
                ? `Show the front of your ${formData.idType.replace('_', ' ')}`
                : `Show the back of your ${formData.idType.replace('_', ' ')}`
            }
          </h3>
          
          <div className="relative mt-2 bg-black rounded-md overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {captureType === 'selfie' && (
              <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full m-4 pointer-events-none"></div>
            )}
            
            {captureType === 'idFront' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-center bg-black/70 p-2 rounded-md">
                  <p>Hold your ID in your hand</p>
                  <p>Make sure all details are clearly visible</p>
                </div>
              </div>
            )}
            
            {captureType === 'idBack' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-center bg-black/70 p-2 rounded-md">
                  <p>Hold your ID in your hand</p>
                  <p>Make sure all details are clearly visible</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            
            {isMobile && (
              <Button variant="outline" onClick={switchCamera}>
                <RefreshCw className="h-4 w-4 mr-2" /> Switch Camera
              </Button>
            )}
            
            <Button onClick={captureImage} className="bg-shield-blue text-white">
              Capture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-6">Identity Verification</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Upload Required Documents</h3>
        <p className="text-gray-600 mb-6">
          Please upload clear images of your {formData.idType.replace('_', ' ')} and a selfie for verification.
          <strong> For security purposes, you need to hold your ID in your hand when taking the photos.</strong>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={`border-2 ${idFrontUploaded ? 'border-green-500' : 'border-dashed'}`}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                {idFrontUploaded ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-shield-light flex items-center justify-center">
                    <Camera className="h-8 w-8 text-shield-blue" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-center mb-2">
                Front Side of {formData.idType.replace('_', ' ')}
              </h4>
              <p className="text-sm text-gray-500 text-center mb-4">
                Show the front side clearly while holding it in your hand
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant={idFrontUploaded ? "outline" : "default"} 
                  className={idFrontUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={idFrontUploaded}
                  onClick={() => openCamera('idFront')}
                >
                  {idFrontUploaded ? "Captured" : "Take Photo"}
                  <Camera className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled={idFrontUploaded}
                  >
                    Upload File
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'idFront')}
                    disabled={idFrontUploaded}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${idBackUploaded ? 'border-green-500' : 'border-dashed'}`}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                {idBackUploaded ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-shield-light flex items-center justify-center">
                    <Camera className="h-8 w-8 text-shield-blue" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-center mb-2">
                Back Side of {formData.idType.replace('_', ' ')}
              </h4>
              <p className="text-sm text-gray-500 text-center mb-4">
                Show the back side clearly while holding it in your hand
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant={idBackUploaded ? "outline" : "default"} 
                  className={idBackUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={idBackUploaded}
                  onClick={() => openCamera('idBack')}
                >
                  {idBackUploaded ? "Captured" : "Take Photo"}
                  <Camera className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled={idBackUploaded}
                  >
                    Upload File
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'idBack')}
                    disabled={idBackUploaded}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${selfieUploaded ? 'border-green-500' : 'border-dashed'}`}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                {selfieUploaded ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-shield-light flex items-center justify-center">
                    <Camera className="h-8 w-8 text-shield-blue" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-center mb-2">
                Selfie Photo
              </h4>
              <p className="text-sm text-gray-500 text-center mb-4">
                Take a clear selfie of your face
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant={selfieUploaded ? "outline" : "default"} 
                  className={selfieUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={selfieUploaded}
                  onClick={() => openCamera('selfie')}
                >
                  {selfieUploaded ? "Captured" : "Take Photo"}
                  <Camera className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled={selfieUploaded}
                  >
                    Upload File
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'selfie')}
                    disabled={selfieUploaded}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isVerifying && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Verification in Progress</h3>
            <div className="mb-2">
              <Progress value={verificationProgress} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Analyzing documents...</span>
              <span>{verificationProgress}%</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-shield-blue mr-2 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <strong>Important:</strong> Please ensure all uploaded documents are:
              <ul className="list-disc ml-5 mt-1">
                <li>Clear and readable</li>
                <li>Not expired</li>
                <li>Showing all corners of the document</li>
                <li>Free from glare or shadows</li>
                <li>Showing you holding the ID in your hand</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-shield-blue text-white hover:bg-blue-600 transition-all w-full md:w-auto md:px-8"
            onClick={startVerification}
            disabled={isVerifying || !idFrontUploaded || !idBackUploaded || !selfieUploaded}
          >
            {isVerifying ? "Verifying..." : "Start Verification"}
          </Button>
        </div>
      </div>
      
      {/* Camera Dialog */}
      {showCamera && <CameraDialog />}
    </div>
  );
};

export default KycVerification;
