import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageChange: (files: File[]) => void;
  multiple?: boolean;
  preview?: string[];
  onRemoveImage?: (index: number) => void;
}

export function ImageUpload({ onImageChange, multiple = false, preview = [], onRemoveImage }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-400">
            <label className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300">
              <span>Upload de imagens</span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  onImageChange(files);
                }}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {preview.map((url, index) => (
            <div key={index} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 