import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CategoryApiService } from '../../services/category.service';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  disabled?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value = '',
  onChange,
  label = 'Category Banner Image',
  folder = 'infinite7_impex/categories',
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploadError(null);
    setUploadSuccess(false);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await CategoryApiService.uploadImage(file, folder);
      onChange(result.url);
      setUploadSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to upload image. Please check your connection or use the direct URL option.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      // Clear file input so the same file could be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearImage = () => {
    onChange('');
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center bg-[#FAF7F2] p-0.5 rounded-lg border border-[#E5DCD1]">
          <button
            type="button"
            disabled={disabled}
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
            disabled={disabled}
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
      </div>

      {/* Existing Image Preview */}
      {value ? (
        <div className="relative rounded-xl border border-[#E5DCD1] bg-[#FAF7F2] p-3 flex items-center gap-4">
          <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#D5CBC0] bg-white shrink-0 relative">
            <img
              src={value}
              alt="Category Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Handle broken image
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
              }}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-semibold text-slate-900 truncate" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Image Linked
              </span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-[#C88A2C] hover:underline"
              >
                View Full
              </a>
            </div>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleClearImage}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Input Options (when no image or when changing) */}
      {!value && (
        <>
          {activeTab === 'upload' ? (
            <div
              onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-[#D5CBC0] hover:border-[#C88A2C] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] rounded-xl p-6 text-center cursor-pointer transition-all ${
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

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5DCD1] shadow-xs flex items-center justify-center mx-auto text-[#C88A2C]">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#C88A2C]" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isUploading ? 'Uploading to Cloudinary...' : 'Click to browse or drop an image'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPEG, PNG, WebP, AVIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  disabled={disabled}
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  value={value}
                  onChange={(e) => onChange(e.target.value.trim())}
                  className="w-full bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Paste a direct image link (e.g. from an existing asset, CDN, or Cloudinary URL).
              </p>
            </div>
          )}
        </>
      )}

      {/* Error alert */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            <p className="font-semibold">Upload failed</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Success feedback */}
      {uploadSuccess && (
        <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Image uploaded and linked successfully!
        </p>
      )}
    </div>
  );
};
