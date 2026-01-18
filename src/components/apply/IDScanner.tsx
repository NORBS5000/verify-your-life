import { useState, useRef } from "react";
import { Camera, Scan, CheckCircle, User, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IDScannerProps {
  onScanComplete: (data: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    sex: string;
    age?: string;
  }) => void;
  onClear?: () => void;
}

export const IDScanner = ({ onScanComplete, onClear }: IDScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScanning(true);
      setError(null);

      // Create preview URL for the captured image
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("user_id", crypto.randomUUID()); // Generate a unique user_id for this upload

        const response = await fetch("https://orionapisalpha.onrender.com/userid/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to analyze ID");
        }

        const data = await response.json();
        
        setScanning(false);
        setCompleted(true);

        // Extract data from API response - handle both 'fields' and 'extracted_fields' keys
        const fields = data.extracted_fields || data.fields || {};
        const fullName = fields["Full Name"] || "";
        const idNumber = fields["ID Number"] || fields["Passport Number"] || "";
        const dateOfBirth = fields["Date of Birth"] || "";
        const gender = fields["Gender"] || fields["Sex"] || "";

        // Calculate age from date of birth
        let age = "";
        if (dateOfBirth) {
          const birthDate = new Date(dateOfBirth);
          const today = new Date();
          const calculatedAge = today.getFullYear() - birthDate.getFullYear();
          // Adjust if birthday hasn't occurred this year
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = String(calculatedAge - 1);
          } else {
            age = String(calculatedAge);
          }
        }

        onScanComplete({
          fullName,
          idNumber,
          dateOfBirth,
          sex: gender,
          age,
        });

        toast.success("ID analyzed successfully!");
      } catch (err) {
        console.error("ID analysis error:", err);
        setScanning(false);
        setCapturedImage(null);
        setError("Failed to analyze ID. Please try again.");
        toast.error("Failed to analyze ID. Please try again.");
      }
    }
  };

  const handleRecapture = () => {
    setCompleted(false);
    setCapturedImage(null);
    setError(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear the extracted data
    onClear?.();
  };

  if (completed) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-health-green bg-teal-50 p-4 transition-all duration-500">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {/* ID Image Display */}
          <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border-2 border-health-green shadow-lg">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured ID" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-teal-100">
                <User className="h-16 w-16 text-health-green/50" />
              </div>
            )}
            {/* Verified badge overlay */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-health-green px-2 py-1 text-xs font-medium text-white shadow-md">
              <CheckCircle className="h-3 w-3" />
              Verified
            </div>
          </div>
          
          {/* Status text */}
          <div className="text-center">
            <p className="text-lg font-semibold text-secondary">ID Verified</p>
            <p className="text-sm text-muted-foreground">Your details have been extracted</p>
          </div>

          {/* Recapture Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRecapture}
            className="gap-2 border-health-green text-health-green hover:bg-health-green hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Recapture ID
          </Button>
        </div>
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-coral-100 p-4">
        <div className="flex flex-col items-center gap-4">
          {/* ID Image Display with scanning effect */}
          <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border-2 border-primary shadow-lg">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Scanning ID" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-coral-100">
                <User className="h-16 w-16 text-primary/30" />
              </div>
            )}
            {/* Scanning overlay */}
            <div className="absolute inset-0 bg-primary/10">
              <div className="animate-scan absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Scan className="h-10 w-10 animate-pulse text-primary drop-shadow-lg" />
            </div>
          </div>
          
          {/* Status text */}
          <div className="text-center">
            <p className="text-lg font-semibold text-secondary">Scanning ID...</p>
            <p className="mt-1 text-sm text-muted-foreground">Extracting your biodata using AI</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCapture}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-coral-100/50 p-8 transition-all duration-300 hover:border-primary hover:bg-coral-100 hover:shadow-coral-glow"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
          <Camera className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-secondary">Capture Your ID</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Take a photo or upload your national ID
          </p>
        </div>
        <div className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 group-hover:shadow-coral-glow">
          Tap to Scan
        </div>
      </div>
    </div>
  );
};
