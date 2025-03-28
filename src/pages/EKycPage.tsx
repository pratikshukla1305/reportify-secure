
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KycForm from '@/components/ekyc/KycForm';
import KycVerification from '@/components/ekyc/KycVerification';
import KycCompleted from '@/components/ekyc/KycCompleted';

const EKycPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    nationality: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleVerificationComplete = () => {
    setCurrentStep(3);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dob: '',
      nationality: '',
      idType: 'passport',
      idNumber: '',
      address: '',
      phone: '',
      email: '',
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow mt-20 container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-shield-dark mb-4">Electronic Know Your Customer (e-KYC)</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Secure and efficient verification of your identity through our blockchain-powered e-KYC system.
            This process helps us protect your account and comply with regulatory requirements.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-shield-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`h-1 w-16 sm:w-24 ${currentStep >= 2 ? 'bg-shield-blue' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-shield-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`h-1 w-16 sm:w-24 ${currentStep >= 3 ? 'bg-shield-blue' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-shield-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm font-medium text-gray-600">
            <div className="w-28 text-center">Personal Information</div>
            <div className="w-28 text-center">Verification</div>
            <div className="w-28 text-center">Completion</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {currentStep === 1 && (
            <KycForm formData={formData} onSubmit={handleFormSubmit} />
          )}
          
          {currentStep === 2 && (
            <KycVerification 
              formData={formData} 
              onComplete={handleVerificationComplete} 
            />
          )}
          
          {currentStep === 3 && (
            <KycCompleted onReset={resetForm} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EKycPage;
