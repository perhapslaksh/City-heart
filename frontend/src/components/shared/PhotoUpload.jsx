// src/components/shared/PhotoUpload.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function PhotoUpload({ photos = [], onChange, maxPhotos = 5 }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (photos.length + acceptedFiles.length > maxPhotos) {
      toast.error(`Max ${maxPhotos} photos allowed`);
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach(f => formData.append('photos', f));
      const { data } = await api.post('/upload/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange([...photos, ...data.urls]);
      toast.success(`${data.urls.length} photo${data.urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error('Upload failed');
    }
    setUploading(false);
  }, [photos, onChange, maxPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    disabled: uploading || photos.length >= maxPhotos,
  });

  const removePhoto = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Preview grid */}
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {photos.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pin rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {photos.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-terracotta bg-terracotta/5' : 'border-sand hover:border-terracotta/50 hover:bg-cream/50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-1.5 text-ink/50">
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span className="text-xs">{isDragActive ? 'Drop here' : `Add photos (${photos.length}/${maxPhotos})`}</span>
                <span className="text-[10px] font-mono text-ink/30">JPG, PNG, WebP · max 5MB each</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
