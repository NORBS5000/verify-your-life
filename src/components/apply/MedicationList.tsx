import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, FlaskConical, CheckCircle2, Pencil, Check, X, Plus, Trash2 } from "lucide-react";

export interface MedicationItem {
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  type: "medication" | "test";
  imageUrl?: string;
  isChronic?: boolean;
  medicalConditions?: string[];
  treatmentDuration?: string;
  consultationNeeded?: boolean;
  consultationCost?: number;
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
  consultationCost?: number;
  onMedicationsChange?: (medications: MedicationItem[]) => void;
}

export const MedicationList = ({ medications, show, prescriptionMetadata, consultationCost = 0, onMedicationsChange }: MedicationListProps) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; dosage: string; quantity: number; unitPrice: number }>({ name: "", dosage: "", quantity: 1, unitPrice: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; dosage: string; quantity: number; unitPrice: number; type: "medication" | "test" }>({
    name: "", dosage: "", quantity: 1, unitPrice: 0, type: "medication",
  });

  if (!show || medications.length === 0 && !showAddForm) return null;

  const editable = !!onMedicationsChange;
  const medicationItems = medications.filter((m) => m.type === "medication");
  const testItems = medications.filter((m) => m.type === "test");

  const startEdit = (index: number) => {
    const item = medications[index];
    setEditValues({ name: item.name, dosage: item.dosage, quantity: item.quantity, unitPrice: item.unitPrice });
    setEditingIndex(index);
  };

  const saveEdit = () => {
    if (editingIndex === null || !onMedicationsChange) return;
    const updated = [...medications];
    updated[editingIndex] = { ...updated[editingIndex], ...editValues };
    onMedicationsChange(updated);
    setEditingIndex(null);
  };

  const cancelEdit = () => setEditingIndex(null);

  const deleteItem = (index: number) => {
    if (!onMedicationsChange) return;
    onMedicationsChange(medications.filter((_, i) => i !== index));
  };

  const addNewItem = () => {
    if (!onMedicationsChange || !newItem.name.trim()) return;
    onMedicationsChange([...medications, { ...newItem, name: newItem.name.trim(), dosage: newItem.dosage.trim() }]);
    setNewItem({ name: "", dosage: "", quantity: 1, unitPrice: 0, type: "medication" });
    setShowAddForm(false);
  };

  const renderItem = (item: MedicationItem, index: number, globalIndex: number) => {
    const isEditing = editingIndex === globalIndex;

    if (isEditing) {
      return (
        <div key={globalIndex} className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={editValues.name}
              onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
              placeholder="Medicine name"
              className="text-sm"
            />
            <Input
              value={editValues.dosage}
              onChange={(e) => setEditValues((v) => ({ ...v, dosage: e.target.value }))}
              placeholder="Dosage"
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={editValues.quantity}
              onChange={(e) => setEditValues((v) => ({ ...v, quantity: Number(e.target.value) || 1 }))}
              placeholder="Quantity"
              className="text-sm"
              min={1}
            />
            <div className="flex items-center text-xs text-muted-foreground px-3">
              Price: KES {editValues.unitPrice.toLocaleString()} (auto)
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 gap-1 text-xs">
              <X className="h-3 w-3" /> Cancel
            </Button>
            <Button size="sm" onClick={saveEdit} className="h-7 gap-1 text-xs">
              <Check className="h-3 w-3" /> Save
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div key={globalIndex} className="group flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
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
              {item.type === "test" ? <FlaskConical className="h-5 w-5 text-accent" /> : <Pill className="h-5 w-5 text-primary" />}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-secondary">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.dosage}{item.type === "medication" && ` • Qty: ${item.quantity}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-secondary">
              KES {(item.unitPrice * item.quantity).toLocaleString()}
            </p>
            {item.type === "medication" && (
              <p className="text-xs text-muted-foreground">@ KES {item.unitPrice.toLocaleString()} each</p>
            )}
          </div>
          {editable && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(globalIndex)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteItem(globalIndex)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

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

      {/* Prescription Details */}
      {prescriptionMetadata && (
        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold text-secondary">Prescription Details</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {prescriptionMetadata.patientName && (
              <div>
                <span className="text-muted-foreground">Patient: </span>
                <span className="font-medium text-foreground">{prescriptionMetadata.patientName}</span>
              </div>
            )}
            {prescriptionMetadata.prescriptionDate && (
              <div>
                <span className="text-muted-foreground">Date: </span>
                <span className="font-medium text-foreground">{prescriptionMetadata.prescriptionDate}</span>
              </div>
            )}
            {prescriptionMetadata.hospitalName && (
              <div>
                <span className="text-muted-foreground">Hospital/Pharmacy: </span>
                <span className="font-medium text-foreground">{prescriptionMetadata.hospitalName}</span>
              </div>
            )}
            {prescriptionMetadata.doctorName && (
              <div>
                <span className="text-muted-foreground">Doctor/Nurse: </span>
                <span className="font-medium text-foreground">{prescriptionMetadata.doctorName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All items rendered in order */}
      <div className="space-y-2">
        {medications.map((item, index) => renderItem(item, index, index))}
      </div>

      {/* Add Medicine Form */}
      {editable && showAddForm && (
        <div className="mt-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={newItem.type === "medication" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setNewItem((v) => ({ ...v, type: "medication" }))}
            >
              <Pill className="h-3 w-3 mr-1" /> Medicine
            </Button>
            <Button
              size="sm"
              variant={newItem.type === "test" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setNewItem((v) => ({ ...v, type: "test" }))}
            >
              <FlaskConical className="h-3 w-3 mr-1" /> Test
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem((v) => ({ ...v, name: e.target.value }))}
              placeholder="Medicine name"
              className="text-sm"
            />
            <Input
              value={newItem.dosage}
              onChange={(e) => setNewItem((v) => ({ ...v, dosage: e.target.value }))}
              placeholder="Dosage"
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem((v) => ({ ...v, quantity: Number(e.target.value) || 1 }))}
              placeholder="Quantity"
              className="text-sm"
              min={1}
            />
            <div className="flex items-center text-xs text-muted-foreground px-3">
              Price set by analysis
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)} className="h-7 gap-1 text-xs">
              <X className="h-3 w-3" /> Cancel
            </Button>
            <Button size="sm" onClick={addNewItem} disabled={!newItem.name.trim()} className="h-7 gap-1 text-xs">
              <Plus className="h-3 w-3" /> Add
            </Button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {editable && !showAddForm && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full gap-1.5 border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" /> Add Medicine Manually
        </Button>
      )}

      {/* Total Summary */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Medications & Tests</span>
          <span className="text-sm font-medium text-secondary">
            KES{" "}
            {medications
              .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
              .toLocaleString()}
          </span>
        </div>
        {consultationCost > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Consultation Fee</span>
            <span className="text-sm font-medium text-secondary">
              KES {consultationCost.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="font-medium text-secondary">Total Retail Cost</span>
          <span className="text-lg font-bold text-secondary">
            KES{" "}
            {(medications
              .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + consultationCost)
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
