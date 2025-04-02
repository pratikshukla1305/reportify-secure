
import React from 'react';
import FilePreviewItem from './FilePreviewItem';

interface FilePreviewListProps {
  files: File[];
  previews: string[];
  uploadProgress: Record<string, number>;
  onRemoveFile: (index: number) => void;
}

const FilePreviewList = ({ files, previews, uploadProgress, onRemoveFile }: FilePreviewListProps) => {
  if (files.length === 0) {
    return <p className="text-center text-gray-500">No files uploaded yet</p>;
  }

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <FilePreviewItem
          key={index}
          file={file}
          preview={previews[index]}
          progress={uploadProgress[file.name] || 0}
          onRemove={() => onRemoveFile(index)}
        />
      ))}
    </div>
  );
};

export default FilePreviewList;
