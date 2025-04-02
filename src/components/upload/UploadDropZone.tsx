
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadDropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const UploadDropZone = ({ onFilesSelected }: UploadDropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected(newFiles);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(newFiles);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6 hover:border-shield-blue transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleBrowseClick}
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-shield-blue/10 flex items-center justify-center mb-4">
        <Upload className="h-8 w-8 text-shield-blue" />
      </div>
      <p className="text-gray-600 mb-2">Drag and drop images here</p>
      <p className="text-sm text-gray-500 mb-4">or</p>
      <Button 
        variant="outline" 
        className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
        onClick={(e) => {
          e.stopPropagation();
          handleBrowseClick();
        }}
      >
        Browse Files
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadDropZone;
