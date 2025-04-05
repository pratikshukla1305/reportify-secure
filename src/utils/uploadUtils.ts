
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const uploadFilesToSupabase = async (files: File[], userId: string | undefined): Promise<string[]> => {
  if (!userId) {
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
      const filePath = `${userId}/${fileName}`;
      
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

export const createDraftReport = async (userId: string, reportId: string, uploadedUrls: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('crime_reports')
      .insert({
        id: reportId,
        user_id: userId,
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
          user_id: userId,
          storage_path: url,
          type: 'video'
        });
        
      if (evidenceError) throw evidenceError;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating report:', error);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};
