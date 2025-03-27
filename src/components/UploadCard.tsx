
import React from 'react';
import { Upload, Image, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UploadCardProps = {
  className?: string;
};

const UploadCard = ({ className }: UploadCardProps) => {
  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Upload Evidence</h3>
        <Shield className="h-5 w-5 text-shield-blue" />
      </div>
      
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6 hover:border-shield-blue transition-colors cursor-pointer">
        <div className="mx-auto w-16 h-16 rounded-full bg-shield-blue/10 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-shield-blue" />
        </div>
        <p className="text-gray-600 mb-2">Drag and drop images here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <Button variant="outline" className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all">
          Browse Files
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-shield-light rounded flex items-center justify-center">
            <Image className="h-5 w-5 text-shield-blue" />
          </div>
          <div className="flex-1">
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-shield-blue" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>image01.jpg</span>
              <span>75%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-shield-light rounded flex items-center justify-center">
            <Image className="h-5 w-5 text-shield-blue" />
          </div>
          <div className="flex-1">
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-full bg-shield-blue" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>image02.jpg</span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          to="/continue-report"
          className="bg-shield-blue text-white hover:bg-blue-600 transition-all"
        >
          Continue to Report
        </Button>
      </div>
    </div>
  );
};

export default UploadCard;
