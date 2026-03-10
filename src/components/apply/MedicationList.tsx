import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, FlaskConical, CheckCircle2 } from "lucide-react";

export interface MedicationItem {
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  type: "medication" | "test";
  imageUrl?: string;
}

export interface PrescriptionMetadata {
  patientName: string;
  prescriptionDate: string;
  hospitalName: string;
  doctorName: string;
}

interface MedicationListProps {
  medications: MedicationItem[];
  show: boolean;
  prescriptionMetadata?: PrescriptionMetadata | null;
}

export const MedicationList = ({ medications, show }: MedicationListProps) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  if (!show || medications.length === 0) return null;

  const medicationItems = medications.filter((m) => m.type === "medication");
  const testItems = medications.filter((m) => m.type === "test");

  return (
    <Card className="animate-slide-up border-0 bg-card p-5 shadow-elegant">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-health-green/10">
            <CheckCircle2 className="h-4 w-4 text-health-green" />
          </div>
          <h3 className="font-serif font-bold text-secondary">Items Found</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Pill className="h-3 w-3" />
            {medicationItems.length} Medications
          </Badge>
          {testItems.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <FlaskConical className="h-3 w-3" />
              {testItems.length} Tests
            </Badge>
          )}
        </div>
      </div>

      {/* Medications Section */}
      {medicationItems.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-secondary">Medications</h4>
          </div>
          <div className="space-y-2">
            {medicationItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <div
                      className="h-10 w-10 cursor-pointer overflow-hidden rounded-full bg-muted ring-2 ring-transparent transition-all hover:ring-primary"
                      onClick={() => setPreviewImage({ url: item.imageUrl!, name: item.name })}
                    >
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-secondary">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.dosage} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-secondary">
                    KES {(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @ KES {item.unitPrice.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tests Section */}
      {testItems.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-secondary">Lab Tests</h4>
          </div>
          <div className="space-y-2">
            {testItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <FlaskConical className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.dosage}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-secondary">
                  KES {item.unitPrice.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Summary */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-secondary">Total Retail Cost</span>
          <span className="text-lg font-bold text-secondary">
            KES{" "}
            {medications
              .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="flex items-center justify-center sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-serif">{previewImage?.name}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center p-4">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[60vh] w-auto rounded-xl object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
