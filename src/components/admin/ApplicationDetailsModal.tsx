import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  FileText, 
  BarChart3, 
  Phone, 
  Calendar, 
  Briefcase,
  Home,
  Car,
  Building2,
  Users,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Image as ImageIcon,
  Pill,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

interface ApplicationData {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  profession: string | null;
  sex: string | null;
  age: number | null;
  date_of_birth: string | null;
  id_number: string | null;
  tin_number: string | null;
  has_business: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  composite_score: number | null;
  medical_needs_score: number | null;
  asset_valuation_score: number | null;
  behavior_risk_score: number | null;
  retail_cost: number | null;
  cova_cost: number | null;
  medical_prescription_url: string | null;
  drug_image_url: string | null;
  bank_statement_url: string | null;
  mpesa_statement_url: string | null;
  call_log_url: string | null;
  home_photo_url: string | null;
  business_photo_url: string | null;
  logbook_url: string | null;
  title_deed_url: string | null;
  asset_pictures_urls: string[] | null;
  guarantor1_phone: string | null;
  guarantor1_id_url: string | null;
  guarantor2_phone: string | null;
  guarantor2_id_url: string | null;
  selected_collateral: string[] | null;
  medical_analysis_data: any | null;
  asset_analysis_data: any | null;
}

interface ApplicationDetailsModalProps {
  application: ApplicationData | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const DocumentLink = ({ url, label }: { url: string | null; label: string }) => {
  if (!url) return null;
  
  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(url);
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
    >
      {isImage && (
        <div className="w-full aspect-video rounded overflow-hidden bg-muted">
          <img src={url} alt={label} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        {isImage ? (
          <ImageIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        )}
        <span className="flex-1 text-sm">{label}</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
      </div>
    </a>
  );
};

const getScoreGradient = (score: number) => {
  if (score >= 70) return [
    { offset: "0%", color: "#22c55e" },
    { offset: "100%", color: "#16a34a" }
  ];
  if (score >= 40) return [
    { offset: "0%", color: "#eab308" },
    { offset: "100%", color: "#ca8a04" }
  ];
  return [
    { offset: "0%", color: "#ef4444" },
    { offset: "100%", color: "#dc2626" }
  ];
};

const ScoreCard = ({ title, score, id }: { title: string; score: number | null; id: string }) => {
  if (score === null) return null;
  
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
      <GradientCircularProgress 
        value={score} 
        size={80} 
        strokeWidth={8}
        gradientId={id}
        gradientColors={getScoreGradient(score)}
      >
        <span className="text-lg font-bold">{score}%</span>
      </GradientCircularProgress>
      <span className="text-sm font-medium text-center">{title}</span>
    </div>
  );
};

export const ApplicationDetailsModal = ({ application, open, onClose, onStatusUpdate }: ApplicationDetailsModalProps) => {
  const [updating, setUpdating] = useState(false);

  if (!application) return null;

  const medicalData = application.medical_analysis_data as any;
  const allMedItems = medicalData ? [
    ...(medicalData.prescriptionItems || []),
    ...(medicalData.medicationItems || []),
  ] : [];

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("loan_applications")
        .update({ status: newStatus })
        .eq("id", application.id);

      if (error) throw error;

      toast.success(`Application ${newStatus} successfully`);
      onStatusUpdate?.();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const documents = [
    { url: application.medical_prescription_url, label: "Medical Prescription" },
    { url: application.drug_image_url, label: "Drug/Medication Image" },
    { url: application.bank_statement_url, label: "Bank Statement" },
    { url: application.mpesa_statement_url, label: "M-Pesa Statement" },
    { url: application.call_log_url, label: "Call Logs" },
    { url: application.home_photo_url, label: "Home Photo" },
    { url: application.business_photo_url, label: "Business Photo" },
    { url: application.logbook_url, label: "Vehicle Logbook" },
    { url: application.title_deed_url, label: "Title Deed" },
    { url: application.guarantor1_id_url, label: "Guarantor 1 ID" },
    { url: application.guarantor2_id_url, label: "Guarantor 2 ID" },
  ].filter(doc => doc.url);

  const assetPhotos = application.asset_pictures_urls || [];
  const isPending = application.status === "pending" || !application.status;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span>Application Details</span>
              <Badge variant={getStatusColor(application.status)}>
                {application.status || "pending"}
              </Badge>
            </DialogTitle>
            {isPending && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("rejected")}
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("approved")}
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents ({documents.length + assetPhotos.length})</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="guarantors" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Guarantors</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* Profile Tab */}
            <TabsContent value="profile" className="m-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Full Name</span>
                    <p className="font-medium">{application.full_name || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Phone Number</span>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {application.phone_number || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">ID Number</span>
                    <p className="font-medium">{application.id_number || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">TIN Number</span>
                    <p className="font-medium">{application.tin_number || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Date of Birth</span>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {application.date_of_birth 
                        ? format(new Date(application.date_of_birth), "MMM d, yyyy")
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Age</span>
                    <p className="font-medium">{application.age || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Sex</span>
                    <p className="font-medium">{application.sex || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Profession</span>
                    <p className="font-medium flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {application.profession || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Has Business</span>
                    <p className="font-medium">{application.has_business ? "Yes" : "No"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Collateral</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.selected_collateral && application.selected_collateral.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {application.selected_collateral.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1">
                          {item === "car" && <Car className="h-3 w-3" />}
                          {item === "house" && <Home className="h-3 w-3" />}
                          {item === "land" && <Building2 className="h-3 w-3" />}
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No collateral selected</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Timeline</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Created</span>
                    <p className="font-medium">
                      {format(new Date(application.created_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Last Updated</span>
                    <p className="font-medium">
                      {format(new Date(application.updated_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="m-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {documents.map((doc, idx) => (
                        <DocumentLink key={idx} url={doc.url} label={doc.label} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No documents uploaded</p>
                  )}
                </CardContent>
              </Card>

              {assetPhotos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset Photos ({assetPhotos.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {assetPhotos.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                        >
                          <img
                            src={url}
                            alt={`Asset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="m-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credit Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ScoreCard title="Composite Score" score={application.composite_score} id="composite" />
                    <ScoreCard title="Medical Needs" score={application.medical_needs_score} id="medical" />
                    <ScoreCard title="Asset Valuation" score={application.asset_valuation_score} id="asset" />
                    <ScoreCard title="Behavior Risk" score={application.behavior_risk_score} id="behavior" />
                  </div>
                  {!application.composite_score && !application.medical_needs_score && 
                   !application.asset_valuation_score && !application.behavior_risk_score && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No analysis scores available yet
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Medical Analysis - Step 2 Data */}
              {medicalData && (
                <>
                  {/* Predicted Conditions */}
                  {medicalData.predictedConditions?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Predicted Conditions
                          {allMedItems.some((m: any) => m.isChronic === true) && (
                            <Badge variant="destructive" className="text-xs">Chronic</Badge>
                          )}
                          {allMedItems.length > 0 && !allMedItems.some((m: any) => m.isChronic === true) && allMedItems.some((m: any) => m.isChronic !== undefined && m.isChronic !== null) && (
                            <Badge variant="secondary" className="text-xs">Acute</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {medicalData.predictedConditions.map((condition: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-sm">{condition}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Medications & Tests List */}
                  {allMedItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Medications & Tests ({allMedItems.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {allMedItems.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{item.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.type === "test" ? "Test" : "Drug"}
                                  </Badge>
                                </div>
                                {item.dosage && (
                                  <p className="text-xs text-muted-foreground ml-6 mt-1">{item.dosage}</p>
                                )}
                                {item.treatmentDuration && (
                                  <p className="text-xs text-muted-foreground ml-6">Duration: {item.treatmentDuration}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">
                                  KES {(item.unitPrice * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} × KES {item.unitPrice?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {medicalData.consultationCost > 0 && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">Consultation Fee</span>
                              </div>
                              <p className="text-sm font-semibold">
                                KES {medicalData.consultationCost.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Cost Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retail Cost</p>
                    <p className="text-2xl font-bold">
                      {application.retail_cost ? `KES ${application.retail_cost.toLocaleString()}` : "-"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COVA Cost</p>
                    <p className="text-2xl font-bold text-primary">
                      {application.cova_cost ? `KES ${application.cova_cost.toLocaleString()}` : "-"}
                    </p>
                  </div>
                  {application.retail_cost && application.cova_cost && (
                    <div className="col-span-2 p-4 rounded-lg bg-green-500/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
                      <p className="text-2xl font-bold text-green-600">
                        KES {(application.retail_cost - application.cova_cost).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Asset Analysis - Step 3 Data */}
              {assetPhotos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset Photos & Valuation ({assetPhotos.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {assetPhotos.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                        >
                          <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!medicalData && assetPhotos.length === 0 && !application.composite_score && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No detailed analysis data available. This application may have been submitted before analysis tracking was enabled.
                </p>
              )}
            </TabsContent>

            {/* Guarantors Tab */}
            <TabsContent value="guarantors" className="m-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guarantor 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Phone Number</span>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {application.guarantor1_phone || "-"}
                    </p>
                  </div>
                  {application.guarantor1_id_url && (
                    <DocumentLink url={application.guarantor1_id_url} label="ID Document" />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guarantor 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Phone Number</span>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {application.guarantor2_phone || "-"}
                    </p>
                  </div>
                  {application.guarantor2_id_url && (
                    <DocumentLink url={application.guarantor2_id_url} label="ID Document" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
