import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
  Plus,
  Sparkles,
} from 'lucide-react';
import { ProductApiService } from '../../services/product.service';

interface MultiImageUploadFieldProps {
  values?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  folder?: string;
  disabled?: boolean;
}

export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  values = [],
  onChange,
  maxImages = 4,
  label = 'Product Gallery Images',
  folder = 'infinite7_impex/products',
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = values.length < maxImages;

  // Handle local file selection and upload to Cloudinary
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await ProductApiService.uploadImage(file, folder);
      onChange([...values, result.url]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to upload image. Please verify your connection or use the direct URL option.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle direct URL addition
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
      onChange([...values, trimmed]);
      setInputUrl('');
      setUploadError(null);
    } catch {
      setUploadError('Please enter a valid image URL (starting with http:// or https://)');
    }
  };

  // Remove an image by index
  const handleRemoveImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
    setUploadError(null);
  };

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}{' '}
          <span className="text-slate-400 font-normal">
            ({values.length}/{maxImages})
          </span>
        </label>

        {canAddMore && (
          <div className="flex items-center bg-[#FAF7F2] p-0.5 rounded-lg border border-[#E5DCD1]">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-[#1A221E] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <UploadCloud className="w-3 h-3 text-[#C88A2C]" />
                <span>Upload File</span>
              </span>
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => setActiveTab('url')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-[#1A221E] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                <span>Image URL</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Existing Images Thumbnails Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {values.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative rounded-xl border border-[#D5CBC0] bg-[#FAF7F2] overflow-hidden aspect-[4/3] flex flex-col shadow-xs"
            >
              <img
                src={url}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200x150?text=Invalid+Image';
                }}
              />

              {/* Cover photo badge on index 0 */}
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-[#00A859] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Cover Photo</span>
                </div>
              )}

              {/* Delete button */}
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-md opacity-80 group-hover:opacity-100"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate backdrop-blur-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Image {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Control (when under maxImages) */}
      {canAddMore && (
        <div className="space-y-2">
          {activeTab === 'upload' ? (
            <div
              onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-[#D5CBC0] hover:border-[#C88A2C] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] rounded-xl p-5 text-center cursor-pointer transition-all ${
                disabled || isUploading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
              />

              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E5DCD1] shadow-xs flex items-center justify-center mx-auto text-[#C88A2C]">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#C88A2C]" />
                  ) : (
                    <UploadCloud className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isUploading ? 'Uploading to Cloudinary...' : 'Click or drop to add product photo'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Up to 4 images ({maxImages - values.length} remaining). First image is the main cover.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  disabled={disabled || isUploading}
                  placeholder="Paste direct image URL (https://...)"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl(e);
                    }
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all font-medium"
                />
              </div>
              <button
                type="button"
                disabled={disabled || isUploading || !inputUrl.trim()}
                onClick={handleAddUrl}
                className="px-4 py-2 rounded-lg bg-[#C88A2C] hover:bg-[#B57A22] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            <p className="font-semibold">Upload failed</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
