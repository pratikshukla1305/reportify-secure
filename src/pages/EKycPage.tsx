
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import KycForm from '@/components/ekyc/KycForm';
import KycVerification from '@/components/ekyc/KycVerification';
import KycCompleted from '@/components/ekyc/KycCompleted';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type KycData = {
  fullName: string;
  dob: string;
  nationality: string;
  idType: "passport" | "national_id" | "driving_license";
  idNumber: string;
  address: string;
  phone: string;
  email: string;
};

const EKycPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<string>("form");
  const [kycData, setKycData] = useState<KycData>({
    fullName: "",
    dob: "",
    nationality: "",
    idType: "national_id",
    idNumber: "",
    address: "",
    phone: "",
    email: ""
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    idFront?: File;
    idBack?: File;
    selfie?: File;
  }>({});

  const handleFormSubmit = (data: KycData) => {
    setKycData(data);
    setCurrentStep("verification");
  };

  const handleVerificationComplete = () => {
    setCurrentStep("completed");
  };

  const handleKycReset = () => {
    // Reset the form and go back to the beginning
    setCurrentStep("form");
    setKycData({
      fullName: "",
      dob: "",
      nationality: "",
      idType: "national_id",
      idNumber: "",
      address: "",
      phone: "",
      email: ""
    });
    setUploadedDocuments({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Electronic Know Your Customer (e-KYC)
            </h1>
            <p className="text-gray-600 mb-8">
              Complete the verification process to access all features of Midshield.
            </p>
            
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger 
                  value="form" 
                  disabled={currentStep !== "form"}
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  1. Personal Information
                </TabsTrigger>
                <TabsTrigger 
                  value="verification" 
                  disabled={currentStep !== "verification" && currentStep !== "completed"}
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  2. Document Verification
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  disabled={currentStep !== "completed"}
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  3. Verification Complete
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="mt-0">
                <KycForm onSubmit={handleFormSubmit} formData={kycData} />
              </TabsContent>
              
              <TabsContent value="verification" className="mt-0">
                <KycVerification 
                  userId="user-123"
                  onComplete={handleVerificationComplete}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <KycCompleted 
                  status="pending"
                  onReset={handleKycReset}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EKycPage;
