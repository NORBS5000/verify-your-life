import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, FileText, BarChart3 } from "lucide-react";

interface LoanApplication {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  profession: string | null;
  sex: string | null;
  age: number | null;
  composite_score: number | null;
  medical_needs_score: number | null;
  asset_valuation_score: number | null;
  behavior_risk_score: number | null;
  status: string | null;
  created_at: string;
  // Document URLs for counting
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
  guarantor1_id_url: string | null;
  guarantor2_id_url: string | null;
}

interface ApplicationsTableProps {
  applications: LoanApplication[];
  onViewApplication: (app: LoanApplication) => void;
}

export const ApplicationsTable = ({ applications, onViewApplication }: ApplicationsTableProps) => {
  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status || "pending"] || "outline"}>
        {status || "pending"}
      </Badge>
    );
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const countDocuments = (app: LoanApplication) => {
    const docs = [
      app.medical_prescription_url,
      app.drug_image_url,
      app.bank_statement_url,
      app.mpesa_statement_url,
      app.call_log_url,
      app.home_photo_url,
      app.business_photo_url,
      app.logbook_url,
      app.title_deed_url,
      app.guarantor1_id_url,
      app.guarantor2_id_url,
    ].filter(Boolean).length;
    
    const assetPhotos = app.asset_pictures_urls?.length || 0;
    return docs + assetPhotos;
  };

  const hasScores = (app: LoanApplication) => {
    return app.composite_score !== null || 
           app.medical_needs_score !== null || 
           app.asset_valuation_score !== null || 
           app.behavior_risk_score !== null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead className="text-center">Docs</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewApplication(app)}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(app.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{app.full_name || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.age ? `${app.age}y` : ""} {app.sex || ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{app.phone_number || "-"}</TableCell>
                <TableCell>{app.profession || "-"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{countDocuments(app)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {app.composite_score !== null ? (
                    <div className="flex items-center justify-center gap-1">
                      <BarChart3 className={`h-3 w-3 ${getScoreColor(app.composite_score)}`} />
                      <span className={`font-semibold ${getScoreColor(app.composite_score)}`}>
                        {app.composite_score}
                      </span>
                    </div>
                  ) : hasScores(app) ? (
                    <Badge variant="outline" className="text-xs">Partial</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewApplication(app);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
