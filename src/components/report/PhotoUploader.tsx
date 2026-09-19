import React, { useRef } from 'react';
import { Camera, Trash2, Image as ImageIcon, ShieldAlert, AlertCircle } from 'lucide-react';

interface PhotoUploaderProps {
  photo: string | null;
  photoName?: string | null;
  onChange: (photoUrl: string | null, photoName?: string | null) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photo, photoName, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview only
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="section-photo" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-neutral-700" />
          <span>Section 6: Add Photo (Optional)</span>
        </label>
        <span className="text-xs text-neutral-500">Optional</span>
      </div>

      <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-3">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          id="photo-upload-input"
          onChange={handleFileChange}
          className="hidden"
        />

        {!photo ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-white rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-neutral-800">
              Tap or click to select a photo
            </div>
            <p className="text-xs text-neutral-500">
              Supports JPG, PNG, WEBP (Photos stored locally in browser memory only)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 flex items-center justify-center max-h-72">
              <img
                src={photo}
                alt="Accident scene preview"
                className="max-h-72 w-auto object-contain rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono">
                {photoName || 'Captured Image'}
              </div>
            </div>

            {/* Remove / Change Action */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline"
              >
                Change Photo
              </button>

              <button
                type="button"
                id="remove-photo-btn"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            </div>
          </div>
        )}

        {/* Safety & Local-Only Notice */}
        <div className="flex items-start gap-2 text-xs text-neutral-600 pt-1">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Safety warning:</strong> Optional — only take or upload an image if it is completely safe to do so. Do not step into active highway traffic. Images are kept strictly local on your device in this prototype.
          </span>
        </div>
      </div>
    </div>
  );
};
