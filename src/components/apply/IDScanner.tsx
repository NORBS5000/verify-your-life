import { useState, useRef } from "react";
import { Camera, Scan, CheckCircle, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IDScannerProps {
  onScanComplete: (data: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    sex: string;
  }) => void;
}

export const IDScanner = ({ onScanComplete }: IDScannerProps) => {
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

        const response = await fetch("https://orionapisalpha.onrender.com/id/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to analyze ID");
        }

        const data = await response.json();
        
        setScanning(false);
        setCompleted(true);

        // Extract data from API response
        const fullName = data.fields?.["Full Name"] || "";
        const idNumber = data.fields?.["ID Number"] || data.fields?.["Passport Number"] || "";

        onScanComplete({
          fullName,
          idNumber,
          dateOfBirth: "", // API doesn't return this, user can fill manually
          sex: "", // API doesn't return this, user can fill manually
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

  if (completed) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-health-green bg-teal-50 p-4 transition-all duration-500">
        <div className="flex items-center gap-4">
          {capturedImage ? (
            <div className="h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg border-2 border-health-green shadow-md">
              <img 
                src={capturedImage} 
                alt="Captured ID" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-health-green text-white">
              <CheckCircle className="h-8 w-8" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-green text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-secondary">ID Verified</p>
              <p className="text-sm text-muted-foreground">Your details have been extracted</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-coral-100 p-4">
        {/* Scanning overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        
        <div className="relative flex items-center gap-4">
          {capturedImage ? (
            <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg border-2 border-primary shadow-md">
              <img 
                src={capturedImage} 
                alt="Scanning ID" 
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                <Scan className="h-8 w-8 animate-pulse text-primary" />
              </div>
            </div>
          ) : (
            <div className="relative h-24 w-36 flex-shrink-0 rounded-lg bg-primary/10">
              <User className="absolute inset-0 m-auto h-12 w-12 text-primary opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="h-8 w-8 animate-pulse text-primary" />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="text-left">
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
