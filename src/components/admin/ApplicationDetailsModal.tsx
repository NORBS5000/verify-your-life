import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
  Download
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
  // Scores
  composite_score: number | null;
  medical_needs_score: number | null;
  asset_valuation_score: number | null;
  behavior_risk_score: number | null;
  // Costs
  retail_cost: number | null;
  cova_cost: number | null;
  // Documents
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
  // Guarantors
  guarantor1_phone: string | null;
  guarantor1_id_url: string | null;
  guarantor2_phone: string | null;
  guarantor2_id_url: string | null;
  // Collateral
  selected_collateral: string[] | null;
}

interface ApplicationDetailsModalProps {
  application: ApplicationData | null;
  open: boolean;
  onClose: () => void;
}

const DocumentLink = ({ url, label }: { url: string | null; label: string }) => {
  if (!url) return null;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
    >
      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
      <span className="flex-1 text-sm">{label}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
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
        <span className="text-lg font-bold">{score}</span>
      </GradientCircularProgress>
      <span className="text-sm font-medium text-center">{title}</span>
    </div>
  );
};

export const ApplicationDetailsModal = ({ application, open, onClose }: ApplicationDetailsModalProps) => {
  if (!application) return null;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Application Details</span>
            <Badge variant={getStatusColor(application.status)}>
              {application.status || "pending"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
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

          <ScrollArea className="flex-1 mt-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    <CardTitle className="text-lg">Asset Photos</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retail Cost</p>
                    <p className="text-2xl font-bold">
                      {application.retail_cost ? `TZS ${application.retail_cost.toLocaleString()}` : "-"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COVA Cost</p>
                    <p className="text-2xl font-bold text-primary">
                      {application.cova_cost ? `TZS ${application.cova_cost.toLocaleString()}` : "-"}
                    </p>
                  </div>
                  {application.retail_cost && application.cova_cost && (
                    <div className="col-span-2 p-4 rounded-lg bg-green-500/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
                      <p className="text-2xl font-bold text-green-600">
                        TZS {(application.retail_cost - application.cova_cost).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
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
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
