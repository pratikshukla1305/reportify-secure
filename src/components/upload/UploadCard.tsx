
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import UploadDropZone from './UploadDropZone';
import FilePreviewList from './FilePreviewList';
import { useFileUpload } from './useFileUpload';

type UploadCardProps = {
  className?: string;
};

const UploadCard = ({ className }: UploadCardProps) => {
  const navigate = useNavigate();
  const { 
    files, 
    previews, 
    uploadProgress, 
    isUploading, 
    handleFilesSelected, 
    removeFile 
  } = useFileUpload();

  const handleContinueToReport = () => {
    // Store files in sessionStorage for access in the report pages
    if (files.length > 0) {
      // Store preview URLs in sessionStorage to use in report
      sessionStorage.setItem('uploadedImages', JSON.stringify(previews));
      navigate("/continue-report");
    } else {
      toast.error("Please upload at least one file before continuing");
    }
  };

  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Upload Evidence</h3>
        <Shield className="h-5 w-5 text-shield-blue" />
      </div>
      
      <UploadDropZone onFilesSelected={handleFilesSelected} />
      
      <FilePreviewList 
        files={files}
        previews={previews}
        uploadProgress={uploadProgress}
        onRemoveFile={removeFile}
      />
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleContinueToReport}
          className="bg-shield-blue text-white hover:bg-blue-600 transition-all"
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? "Uploading..." : "Continue to Report"}
        </Button>
      </div>
    </div>
  );
};

export default UploadCard;
