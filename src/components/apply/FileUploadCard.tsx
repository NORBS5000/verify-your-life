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
      className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
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

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
            isVerified
              ? "bg-health-green text-white"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          }`}
        >
          {isVerifying ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isVerified ? (
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
            {isVerified && (
              <span className="rounded-full bg-health-green/20 px-2 py-0.5 text-xs font-medium text-health-green">
                Verified
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
          {file && (
            <p className="mt-2 truncate text-sm font-medium text-primary">
              📎 {file.name}
            </p>
          )}
        </div>

        {!isVerified && !isVerifying && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Upload className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};