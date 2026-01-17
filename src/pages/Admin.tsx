import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { LogOut, Loader2, Lock } from "lucide-react";
import SecurityFooter from "@/components/SecurityFooter";

interface LoanApplication {
  id: string;
  phone_number: string | null;
  profession: string | null;
  sex: string | null;
  age: number | null;
  composite_score: number | null;
  status: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, checkAdminAccess } = useUserRole();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setShowPinInput(false);
      fetchApplications();
    }
  }, [isAdmin]);

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

  const handleSignOut = () => {
    navigate("/");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage loan applications
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>
              View and manage all loan applications submitted by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          {format(new Date(app.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{app.phone_number || "-"}</TableCell>
                        <TableCell>{app.profession || "-"}</TableCell>
                        <TableCell>{app.age || "-"}</TableCell>
                        <TableCell>{app.sex || "-"}</TableCell>
                        <TableCell>
                          {app.composite_score ? (
                            <span className="font-semibold">{app.composite_score}</span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SecurityFooter />
    </div>
  );
};

export default Admin;
