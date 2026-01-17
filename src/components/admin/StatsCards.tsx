import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, Users } from "lucide-react";

interface StatsCardsProps {
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  averageScore: number | null;
  documentsCount: number;
}

export const StatsCards = ({
  totalApplications,
  pendingCount,
  approvedCount,
  rejectedCount,
  averageScore,
  documentsCount,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Review",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Approved",
      value: approvedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Avg. Score",
      value: averageScore !== null ? averageScore.toFixed(0) : "-",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Documents",
      value: documentsCount,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
