
import React, { useState } from 'react';
import { Camera, Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

type KycVerificationProps = {
  formData: {
    fullName: string;
    idType: string;
    idNumber: string;
  };
  onComplete: () => void;
};

const KycVerification = ({ formData, onComplete }: KycVerificationProps) => {
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate upload
    setTimeout(() => {
      switch (type) {
        case 'front':
          setIdFrontUploaded(true);
          toast({
            title: "Front side uploaded",
            description: "Your ID front side was successfully uploaded.",
          });
          break;
        case 'back':
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

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-6">Identity Verification</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Upload Required Documents</h3>
        <p className="text-gray-600 mb-6">
          Please upload clear images of your {formData.idType.replace('_', ' ')} and a selfie for verification
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
                Show the front side clearly
              </p>
              <div className="relative">
                <Button 
                  variant={idFrontUploaded ? "outline" : "default"} 
                  className={idFrontUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={idFrontUploaded}
                >
                  {idFrontUploaded ? "Uploaded" : "Upload"}
                  {!idFrontUploaded && <Upload className="ml-2 h-4 w-4" />}
                </Button>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  disabled={idFrontUploaded}
                />
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
                Show the back side clearly
              </p>
              <div className="relative">
                <Button 
                  variant={idBackUploaded ? "outline" : "default"} 
                  className={idBackUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={idBackUploaded}
                >
                  {idBackUploaded ? "Uploaded" : "Upload"}
                  {!idBackUploaded && <Upload className="ml-2 h-4 w-4" />}
                </Button>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  disabled={idBackUploaded}
                />
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
              <div className="relative">
                <Button 
                  variant={selfieUploaded ? "outline" : "default"} 
                  className={selfieUploaded ? "border-green-500 text-green-500" : "bg-shield-blue text-white"}
                  disabled={selfieUploaded}
                >
                  {selfieUploaded ? "Uploaded" : "Upload"}
                  {!selfieUploaded && <Upload className="ml-2 h-4 w-4" />}
                </Button>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  disabled={selfieUploaded}
                />
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
    </div>
  );
};

export default KycVerification;
