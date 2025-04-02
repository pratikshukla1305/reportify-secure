
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload progress
      simulateFileUpload(file.name);
    });
    
    toast.success(`${newFiles.length} file(s) added successfully`);
  };

  const simulateFileUpload = (fileName: string) => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Check if all files are uploaded after a short delay
        setTimeout(() => {
          const allUploaded = Object.values({
            ...uploadProgress,
            [fileName]: 100
          }).every(p => p === 100);
          
          if (allUploaded) {
            setIsUploading(false);
          }
        }, 500);
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 500);
  };

  const removeFile = (index: number) => {
    const fileName = files[index]?.name;
    
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    
    // Remove from progress tracking
    if (fileName) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });
    }
    
    toast.info("File removed");
  };

  return {
    files,
    previews,
    uploadProgress,
    isUploading,
    handleFilesSelected,
    removeFile
  };
};
