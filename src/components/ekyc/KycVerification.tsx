import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, RotateCw, Shield, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Define the props type
type KycVerificationProps = {
  formData: {
    fullName: string;
    dob: string;
    nationality: string;
    idType: "passport" | "national_id" | "driving_license";
    idNumber: string;
    address: string;
    phone: string;
    email: string;
  };
  onComplete: () => void;
};

const KycVerification = ({ formData, onComplete }: KycVerificationProps) => {
  const [step, setStep] = useState(1);
  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [currentCaptureType, setCurrentCaptureType] = useState<'frontId' | 'backId' | 'selfie' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  
  // Handle camera open
  const openCamera = (type: 'frontId' | 'backId' | 'selfie') => {
    setCurrentCaptureType(type);
    setCameraOpen(true);
  };

  // Simulate capture
  const captureImage = () => {
    // Simulate camera capture with a delay
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate a placeholder image (colored rectangle)
      let color;
      if (currentCaptureType === 'frontId') color = '#e3f2fd';
      else if (currentCaptureType === 'backId') color = '#e8f5e9';
      else color = '#fff3e0';
      
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some visual elements to make it look like an ID or selfie
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        
        if (currentCaptureType === 'frontId') {
          ctx.fillText('ID CARD - FRONT', 150, 30);
          // Draw a rectangle for photo area
          ctx.strokeStyle = '#999';
          ctx.strokeRect(30, 60, 100, 120);
          // Draw lines for name, etc.
          ctx.fillRect(150, 70, 200, 1);
          ctx.fillRect(150, 100, 200, 1);
          ctx.fillRect(150, 130, 200, 1);
        } else if (currentCaptureType === 'backId') {
          ctx.fillText('ID CARD - BACK', 150, 30);
          // Draw rectangle for signature
          ctx.strokeStyle = '#999';
          ctx.strokeRect(30, 170, 300, 50);
          // Draw barcode-like lines
          for (let i = 0; i < 10; i++) {
            ctx.fillRect(50, 60 + i*10, 300 - i*20, 5);
          }
        } else {
          ctx.fillText('SELFIE WITH ID', 150, 30);
          // Draw face outline
          ctx.beginPath();
          ctx.arc(200, 150, 80, 0, Math.PI * 2);
          ctx.stroke();
          // Draw ID card outline in hand
          ctx.strokeRect(100, 200, 200, 80);
        }
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      
      if (currentCaptureType === 'frontId') {
        setFrontIdImage(dataUrl);
      } else if (currentCaptureType === 'backId') {
        setBackIdImage(dataUrl);
      } else if (currentCaptureType === 'selfie') {
        setSelfieImage(dataUrl);
      }
      
      setIsLoading(false);
      setCameraOpen(false);
      setCurrentCaptureType(null);
    }, 2000);
  };

  const proceedToVerification = () => {
    setStep(2);
    setVerificationStatus('processing');
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus('completed');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-shield-dark">Identity Verification</h2>
      
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-shield-dark mb-2">Document Verification Instructions:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Ensure your ID document is valid and not expired</li>
              <li>Hold your ID in your hand when taking the photos</li>
              <li>Make sure all details are clearly visible and not covered by your fingers</li>
              <li>Avoid glare and shadows on your documents</li>
              <li>Take the selfie while holding your ID document for additional verification</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Front ID Capture */}
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <h3 className="font-medium mb-3">Front of ID</h3>
              {frontIdImage ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-3">
                  <img 
                    src={frontIdImage} 
                    alt="Front of ID" 
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => openCamera('frontId')}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-48 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer mb-3"
                  onClick={() => openCamera('frontId')}
                >
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to capture</p>
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                Hold your ID document and take a photo of the front side
              </p>
            </div>
            
            {/* Back ID Capture */}
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <h3 className="font-medium mb-3">Back of ID</h3>
              {backIdImage ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-3">
                  <img 
                    src={backIdImage} 
                    alt="Back of ID" 
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => openCamera('backId')}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-48 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer mb-3"
                  onClick={() => openCamera('backId')}
                >
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to capture</p>
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                Hold your ID document and take a photo of the back side
              </p>
            </div>
            
            {/* Selfie with ID Capture */}
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <h3 className="font-medium mb-3">Selfie with ID</h3>
              {selfieImage ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-3">
                  <img 
                    src={selfieImage} 
                    alt="Selfie with ID" 
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => openCamera('selfie')}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-48 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer mb-3"
                  onClick={() => openCamera('selfie')}
                >
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to capture</p>
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                Take a selfie while holding your ID document
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              className="bg-shield-blue text-white w-full md:w-auto"
              disabled={!frontIdImage || !backIdImage || !selfieImage}
              onClick={proceedToVerification}
            >
              Continue to Verification
            </Button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            {verificationStatus === 'processing' && (
              <>
                <div className="rounded-full bg-blue-50 p-4 mb-4">
                  <Loader2 className="h-12 w-12 text-shield-blue animate-spin" />
                </div>
                <h3 className="text-xl font-medium text-shield-dark">Verifying your identity</h3>
                <p className="text-gray-500 mt-2 text-center">
                  Please wait while we verify your identity. This usually takes less than a minute.
                </p>
              </>
            )}
            
            {verificationStatus === 'completed' && (
              <>
                <div className="rounded-full bg-green-50 p-4 mb-4">
                  <Shield className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-shield-dark">Verification Successful</h3>
                <p className="text-gray-500 mt-2 text-center">
                  Your identity has been successfully verified.
                </p>
                <div className="mt-6">
                  <Button 
                    className="bg-shield-blue text-white px-8"
                    onClick={onComplete}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Complete Verification
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onOpenChange={(open) => !open && setCameraOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>
            {currentCaptureType === 'frontId' && 'Capture Front of ID'}
            {currentCaptureType === 'backId' && 'Capture Back of ID'}
            {currentCaptureType === 'selfie' && 'Take Selfie with ID'}
          </DialogTitle>
          <DialogDescription>
            {currentCaptureType === 'selfie' 
              ? 'Make sure your face and ID document are clearly visible' 
              : 'Hold the ID in your hand and make sure all details are clearly visible'}
          </DialogDescription>
          
          <div className="relative bg-black rounded-md overflow-hidden aspect-video">
            {/* Camera viewfinder - this would be a real camera feed in a production app */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Guide overlay */}
              {currentCaptureType === 'frontId' && (
                <div className="border-2 border-dashed border-white/70 w-4/5 h-3/5 rounded"></div>
              )}
              {currentCaptureType === 'backId' && (
                <div className="border-2 border-dashed border-white/70 w-4/5 h-3/5 rounded"></div>
              )}
              {currentCaptureType === 'selfie' && (
                <>
                  <div className="border-2 border-dashed border-white/70 w-4/5 h-4/5 rounded-full"></div>
                  <div className="absolute bottom-0 border-2 border-dashed border-white/70 w-3/5 h-1/4 rounded"></div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setCameraOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={captureImage}
              disabled={isLoading}
              className="bg-shield-blue text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KycVerification;
