
import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type KycCompletedProps = {
  onReset: () => void;
};

const KycCompleted = ({ onReset }: KycCompletedProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <ShieldCheck className="h-12 w-12 text-green-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Verification Successful!</h2>
      
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        Your identity has been successfully verified using our secure blockchain technology.
        You now have full access to all Midshield services.
      </p>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-10">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium mb-2">Enhanced Security</h3>
          <p className="text-sm text-gray-600">
            Your identity is now securely verified with blockchain technology
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium mb-2">Full Access</h3>
          <p className="text-sm text-gray-600">
            Enjoy complete access to all Midshield features and services
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium mb-2">Regular Updates</h3>
          <p className="text-sm text-gray-600">
            Periodic reviews to ensure your information stays current and secure
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
        >
          Start a New Verification
        </Button>
        
        <Button 
          to="/home"
          className="bg-shield-blue text-white hover:bg-blue-600 transition-all"
        >
          Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default KycCompleted;
