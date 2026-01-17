import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Loader2, Lock, Search, RefreshCw, Filter } from "lucide-react";
import SecurityFooter from "@/components/SecurityFooter";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { ApplicationDetailsModal } from "@/components/admin/ApplicationDetailsModal";
import { StatsCards } from "@/components/admin/StatsCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoanApplication {
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
  composite_score: number | null;
  medical_needs_score: number | null;
  asset_valuation_score: number | null;
  behavior_risk_score: number | null;
  retail_cost: number | null;
  cova_cost: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
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
  guarantor1_phone: string | null;
  guarantor1_id_url: string | null;
  guarantor2_phone: string | null;
  guarantor2_id_url: string | null;
  selected_collateral: string[] | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, checkAdminAccess } = useUserRole();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setShowPinInput(false);
      fetchApplications();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const handlePinSubmit = () => {
    if (checkAdminAccess(adminPin)) {
      toast.success("Admin access granted");
      setShowPinInput(false);
      fetchApplications();
    } else {
      toast.error("Invalid admin PIN");
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch applications");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.full_name?.toLowerCase().includes(query) ||
        app.phone_number?.toLowerCase().includes(query) ||
        app.profession?.toLowerCase().includes(query) ||
        app.id_number?.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleViewApplication = (app: LoanApplication) => {
    setSelectedApplication(app);
    setModalOpen(true);
  };

  const handleSignOut = () => {
    navigate("/");
  };

  // Calculate stats
  const totalApplications = applications.length;
  const pendingCount = applications.filter(app => app.status === "pending").length;
  const approvedCount = applications.filter(app => app.status === "approved").length;
  const rejectedCount = applications.filter(app => app.status === "rejected").length;
  
  const scoresWithValues = applications.filter(app => app.composite_score !== null);
  const averageScore = scoresWithValues.length > 0
    ? scoresWithValues.reduce((sum, app) => sum + (app.composite_score || 0), 0) / scoresWithValues.length
    : null;

  const documentsCount = applications.reduce((count, app) => {
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
    return count + docs + assetPhotos;
  }, 0);

  // Show PIN input if not authenticated as admin
  if (showPinInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter admin PIN to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin PIN"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handlePinSubmit}>
                Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto p-6 space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Financial Institution Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Review loan applications, documents, and credit analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchApplications}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalApplications={totalApplications}
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
          averageScore={averageScore}
          documentsCount={documentsCount}
        />

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, profession, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Loan Applications</span>
              <Badge variant="outline">{filteredApplications.length} results</Badge>
            </CardTitle>
            <CardDescription>
              Click on any row to view full application details, documents, and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationsTable 
              applications={filteredApplications} 
              onViewApplication={handleViewApplication}
            />
          </CardContent>
        </Card>
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <SecurityFooter />
    </div>
  );
};

export default Admin;
