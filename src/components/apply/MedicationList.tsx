import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, FlaskConical, Eye, CheckCircle2 } from "lucide-react";

export interface MedicationItem {
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  type: "medication" | "test";
}

interface MedicationListProps {
  medications: MedicationItem[];
  show: boolean;
}

export const MedicationList = ({ medications, show }: MedicationListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!show || medications.length === 0) return null;

  const medicationItems = medications.filter((m) => m.type === "medication");
  const testItems = medications.filter((m) => m.type === "test");
  const displayItems = medications.slice(0, 3);
  const remainingCount = medications.length - 3;

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

      {/* Preview List */}
      <div className="space-y-2">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                item.type === "medication" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-teal-100 text-teal-600"
              }`}>
                {item.type === "medication" ? (
                  <Pill className="h-4 w-4" />
                ) : (
                  <FlaskConical className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.dosage} • Qty: {item.quantity}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-secondary">
              KES {(item.unitPrice * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* View Details Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="mt-3 w-full gap-2 text-primary hover:bg-primary/5 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
            View All Details
            {remainingCount > 0 && (
              <Badge variant="outline" className="ml-1">
                +{remainingCount} more
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <CheckCircle2 className="h-5 w-5 text-health-green" />
              Prescription Analysis
            </DialogTitle>
          </DialogHeader>

          {/* Medications Section */}
          {medicationItems.length > 0 && (
            <div className="mt-4">
              <div className="mb-3 flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-secondary">Medications</h4>
                <Badge variant="secondary">{medicationItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {medicationItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.dosage} • Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary">
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
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-600" />
                <h4 className="font-semibold text-secondary">Lab Tests</h4>
                <Badge variant="secondary">{testItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {testItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                        <FlaskConical className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.dosage}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-secondary">
                      KES {item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Summary */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/10 to-coral-100/50 p-4">
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
        </DialogContent>
      </Dialog>
    </Card>
  );
};
