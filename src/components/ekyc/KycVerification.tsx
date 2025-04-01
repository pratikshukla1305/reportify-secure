import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Upload, Shield, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface KycVerificationProps {
  userId: string;
  onComplete?: () => void; // Add the missing prop
}

const KycVerification = ({ userId, onComplete }: KycVerificationProps) => {
  const [activeTab, setActiveTab] = useState("id");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  const handleSubmit = () => {
    // Simulate submitting verification documents
    setIsSubmitting(true);
    
    setTimeout(() => {
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
                <Label htmlFor="id-front">Upload Front of ID</Label>
                <input
                  type="file"
                  id="id-front"
                  className="hidden"
                  onChange={handleIdFrontChange}
                />
                <Button asChild variant="outline">
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
                {idFront && (
                  <img
                    src={URL.createObjectURL(idFront)}
                    alt="ID Front Preview"
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="idBack" className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="id-back">Upload Back of ID</Label>
                <input
                  type="file"
                  id="id-back"
                  className="hidden"
                  onChange={handleIdBackChange}
                />
                <Button asChild variant="outline">
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
                {idBack && (
                  <img
                    src={URL.createObjectURL(idBack)}
                    alt="ID Back Preview"
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="selfie" className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="selfie">Upload Selfie</Label>
                <input
                  type="file"
                  id="selfie"
                  className="hidden"
                  onChange={handleSelfieChange}
                />
                <Button asChild variant="outline">
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
                {selfie && (
                  <img
                    src={URL.createObjectURL(selfie)}
                    alt="Selfie Preview"
                    className="mt-2 rounded-md"
                  />
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
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!isComplete ? (
          <Button onClick={handleSubmit} disabled={isSubmitting || !idFront || !idBack || !selfie}>
            {isSubmitting ? (
              <>
                Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </Button>
        ) : (
          <Button onClick={() => {}}>
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default KycVerification;
