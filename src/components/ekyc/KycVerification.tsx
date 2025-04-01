
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Upload, Shield, X, Eye } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { addKycVerification, getKycVerificationByUserId } from '@/data/kycVerificationsData';

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

  useEffect(() => {
    // Check if verification already exists
    const existingVerification = getKycVerificationByUserId(userId);
    if (existingVerification && existingVerification.status !== 'rejected') {
      setIsComplete(true);
    }
  }, [userId]);

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

  const handleSubmit = () => {
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
                  </div>
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

      {/* Fullscreen preview sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="w-full sm:max-w-full">
          <SheetHeader>
            <SheetTitle>
              {previewType === "idFront" ? "ID Front" : 
               previewType === "idBack" ? "ID Back" : "Selfie"} Preview
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
    </Card>
  );
}

export default KycVerification;
