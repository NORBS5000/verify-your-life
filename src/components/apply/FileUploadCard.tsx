import { useState, useRef } from "react";
import { Camera, CheckCircle, Upload, Loader2 } from "lucide-react";

interface FileUploadCardProps {
  label: string;
  description?: string;
  helpText?: string;
  icon?: React.ReactNode;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
}

export const FileUploadCard = ({
  label,
  description,
  helpText,
  icon,
  file,
  onFileChange,
  accept = "image/*",
  required = false,
}: FileUploadCardProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setIsVerifying(true);
      
      // Simulate verification
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        onFileChange(selectedFile);
      }, 1500);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 ${
        isVerified
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
        className="hidden"
      />

      <div className="flex items-start gap-2 sm:gap-4">
        <div
          className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
            isVerified
              ? "bg-health-green text-white"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          }`}
        >
          {isVerifying ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          ) : isVerified ? (
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : icon ? (
            icon
          ) : (
            <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <p className="font-semibold text-secondary text-sm sm:text-base">
              {label}
              {required && <span className="ml-1 text-primary">*</span>}
            </p>
            {isVerified && (
              <span className="rounded-full bg-health-green/20 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-health-green whitespace-nowrap">
                Verified
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">{description}</p>
          )}
          {helpText && (
            <p className="mt-1.5 sm:mt-2 rounded-lg bg-muted/50 p-1.5 sm:p-2 text-[10px] sm:text-xs text-muted-foreground">
              💡 {helpText}
            </p>
          )}
          {file && (
            <p className="mt-1.5 sm:mt-2 truncate text-xs sm:text-sm font-medium text-primary max-w-full">
              📎 {file.name}
            </p>
          )}
        </div>

        {!isVerified && !isVerifying && (
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white flex-shrink-0">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        )}
      </div>
    </div>
  );
};