
import React, { useState, useRef } from 'react';
import { Upload, Image, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

type UploadCardProps = {
  className?: string;
};

const UploadCard = ({ className }: UploadCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
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
    }
  };
  
  const simulateFileUpload = (fileName: string) => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Check if all files are uploaded
        const allUploaded = Object.values(uploadProgress).every(p => p === 100);
        if (allUploaded) {
          setIsUploading(false);
        }
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 500);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
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
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    
    // Remove from progress tracking
    const fileName = files[index].name;
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    
    toast.info("File removed");
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const uploadFilesToSupabase = async (): Promise<string[]> => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return [];
    }
    
    if (files.length === 0) return [];
    
    const reportId = uuidv4();
    const uploadedUrls: string[] = [];
    
    // Check if evidence bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const evidenceBucketExists = buckets?.some(bucket => bucket.name === 'evidence');
    
    if (!evidenceBucketExists) {
      // Create the bucket if it doesn't exist
      await supabase.storage.createBucket('evidence', {
        public: false,
      });
    }
    
    // Upload each file
    for (const [index, file] of files.entries()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${reportId}-${index}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error } = await supabase.storage
          .from('evidence')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) throw error;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('evidence')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
        
      } catch (error: any) {
        console.error('Error uploading file:', error);
        toast.error(`Error uploading ${file.name}: ${error.message}`);
      }
    }
    
    return uploadedUrls;
  };
  
  const handleContinueToReport = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file before continuing");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to continue");
      navigate("/signin");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload files to Supabase storage
      const uploadedUrls = await uploadFilesToSupabase();
      
      if (uploadedUrls.length === 0) {
        toast.error("Failed to upload files. Please try again.");
        return;
      }
      
      // Store preview URLs in sessionStorage to use in report
      sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedUrls));
      
      // Create a draft report
      const reportId = uuidv4();
      const { error } = await supabase
        .from('crime_reports')
        .insert({
          id: reportId,
          user_id: user.id,
          title: "Draft Report",
          status: "draft"
        });
        
      if (error) throw error;
      
      // Insert evidence records
      for (const url of uploadedUrls) {
        const { error: evidenceError } = await supabase
          .from('evidence')
          .insert({
            report_id: reportId,
            user_id: user.id,
            storage_path: url,
            type: 'image'
          });
          
        if (evidenceError) throw evidenceError;
      }
      
      // Navigate to continue report page
      navigate(`/continue-report?id=${reportId}`);
      
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Upload Evidence</h3>
        <Shield className="h-5 w-5 text-shield-blue" />
      </div>
      
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
      
      <div className="space-y-4">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-shield-light rounded flex items-center justify-center overflow-hidden">
                {previews[index] ? (
                  <img src={previews[index]} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                  <Image className="h-5 w-5 text-shield-blue" />
                )}
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-shield-blue" 
                    style={{ width: `${uploadProgress[file.name] || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{file.name}</span>
                  <span>{uploadProgress[file.name] === 100 ? 'Complete' : `${uploadProgress[file.name] || 0}%`}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No files uploaded yet</p>
        )}
      </div>
      
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
