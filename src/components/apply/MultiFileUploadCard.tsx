import { useState, useRef } from "react";
import { Camera, CheckCircle, Upload, Loader2, X, Plus } from "lucide-react";

interface MultiFileUploadCardProps {
  label: string;
  description?: string;
  helpText?: string;
  icon?: React.ReactNode;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  required?: boolean;
  maxFiles?: number;
}

export const MultiFileUploadCard = ({
  label,
  description,
  helpText,
  icon,
  files,
  onFilesChange,
  accept = "image/*",
  required = false,
  maxFiles = 10,
}: MultiFileUploadCardProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setIsVerifying(true);
      
      // Simulate verification
      setTimeout(() => {
        setIsVerifying(false);
        const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
        onFilesChange(newFiles);
      }, 1000);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
          hasFiles
            ? "border-health-green bg-teal-50"
            : "border-dashed border-border hover:border-primary hover:bg-coral-100/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          capture="environment"
          onChange={handleFileChange}
          multiple
          className="hidden"
        />

        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
              hasFiles
                ? "bg-health-green text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            }`}
          >
            {isVerifying ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : hasFiles ? (
              <CheckCircle className="h-6 w-6" />
            ) : icon ? (
              icon
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-secondary">
                {label}
                {required && <span className="ml-1 text-primary">*</span>}
              </p>
              {hasFiles && (
                <span className="rounded-full bg-health-green/20 px-2 py-0.5 text-xs font-medium text-health-green">
                  {files.length} file{files.length > 1 ? "s" : ""} uploaded
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {helpText && (
              <p className="mt-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                💡 {helpText}
              </p>
            )}
          </div>

          {!hasFiles && !isVerifying && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Upload className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {hasFiles && (
        <div className="space-y-2 pl-16">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="truncate text-sm font-medium text-foreground">
                📎 {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => removeFile(index, e)}
                className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          
          {files.length < maxFiles && (
            <button
              type="button"
              onClick={handleClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add more photos ({files.length}/{maxFiles})
            </button>
          )}
        </div>
      )}
    </div>
  );
};
