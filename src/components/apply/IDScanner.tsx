import { useState, useRef } from "react";
import { Camera, Scan, CheckCircle, User } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScanning(true);
      
      // Simulate AI scanning with delay
      setTimeout(() => {
        setScanning(false);
        setCompleted(true);
        
        // Simulated extracted data
        onScanComplete({
          fullName: "John Mwangi Kamau",
          idNumber: "32456789",
          dateOfBirth: "1988-05-15",
          sex: "male",
        });
      }, 2500);
    }
  };

  if (completed) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-health-green bg-teal-50 p-8 transition-all duration-500">
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-health-green text-white">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary">ID Verified</p>
            <p className="text-sm text-muted-foreground">Your details have been extracted</p>
          </div>
        </div>
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-coral-100 p-8">
        {/* Scanning overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-scan absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        
        <div className="relative flex flex-col items-center justify-center gap-4 py-8">
          <div className="relative">
            <User className="h-20 w-20 text-primary opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Scan className="h-12 w-12 animate-pulse text-primary" />
            </div>
          </div>
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