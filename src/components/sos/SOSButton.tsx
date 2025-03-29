
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  onClick: () => void;
  className?: string;
}

const SOSButton = ({ onClick, className }: SOSButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg animate-pulse",
        className
      )}
      size="lg"
    >
      <AlertCircle className="mr-2 h-6 w-6" />
      <span className="text-lg font-bold">SOS</span>
    </Button>
  );
};

export default SOSButton;
