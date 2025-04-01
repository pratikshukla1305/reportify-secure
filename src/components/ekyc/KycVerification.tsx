
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Camera, Check, X, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import KycCompleted from './KycCompleted';
import { 
  getUserVerificationStatus, 
  addKycVerification, 
  VerificationStatus 
} from '@/data/kycVerificationsData';

interface KycVerificationProps {
  userId: string; // In a real app, this would come from auth context
}

const KycVerification = ({ userId = "user-123" }: KycVerificationProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | 'none'>('none');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the user already has a verification status
    const status = getUserVerificationStatus(userId);
    setVerificationStatus(status);
    
    // For demo purposes, pre-fill form data
    setName('John Doe');
    setEmail('john.doe@example.com');
  }, [userId]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // This would be a real camera integration in a production app
  const handleTakeSelfie = () => {
    setIsCameraOpen(true);
  };
  
  const handleCaptureSelfie = () => {
    // In a real app, this would capture from the camera
    // For demo, we'll just use a sample image
    setSelfiePreview('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80');
    setIsCameraOpen(false);
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !email) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and email.",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!documentPreview) {
        toast({
          title: "Missing Document",
          description: "Please upload your identification document.",
          variant: "destructive"
        });
        return;
      }
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!selfiePreview) {
      toast({
        title: "Missing Selfie",
        description: "Please upload a selfie for facial verification.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit to our shared data store
    addKycVerification({
      userId,
      name,
      email,
      document: documentPreview || '', // In real app, this would be uploaded to secure storage
      photo: selfiePreview || '', // In real app, this would be uploaded to secure storage
      status: 'pending',
      submissionDate: new Date().toISOString()
    });
    
    // Update local status
    setVerificationStatus('pending');
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Verification Submitted",
        description: "Your identity verification request has been submitted and is awaiting review.",
      });
    }, 1500);
  };

  // If user has already submitted verification
  if (verificationStatus !== 'none') {
    return <KycCompleted status={verificationStatus} />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Identity Verification (KYC)</CardTitle>
        <CardDescription>We need to verify your identity for security purposes</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Upload Identification Document</Label>
              <p className="text-sm text-gray-500">Please upload a valid government-issued ID (passport, driver's license, etc.)</p>
              
              {documentPreview ? (
                <div className="mt-2 relative">
                  <img 
                    src={documentPreview} 
                    alt="ID Document Preview" 
                    className="w-full h-auto rounded-md border"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setDocumentFile(null);
                      setDocumentPreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*, application/pdf" 
                        className="hidden" 
                        onChange={handleDocumentUpload}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Upload Selfie</Label>
              <p className="text-sm text-gray-500">Please upload a clear photo of your face for verification</p>
              
              {selfiePreview ? (
                <div className="mt-2 relative">
                  <img 
                    src={selfiePreview} 
                    alt="Selfie Preview" 
                    className="w-40 h-40 object-cover rounded-md border mx-auto"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">Upload from device</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleSelfieUpload}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500">OR</div>
                  
                  <div className="w-full sm:w-1/2">
                    <Button 
                      variant="outline" 
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100"
                      onClick={handleTakeSelfie}
                    >
                      <Camera className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Take a selfie</p>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        )}
      </CardFooter>
      
      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take a Selfie</DialogTitle>
            <DialogDescription>
              Position your face within the frame and ensure good lighting
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-200 w-full h-64 rounded-md flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-500" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCameraOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCaptureSelfie}>
              Capture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default KycVerification;
