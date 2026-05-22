import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalPrograms: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("stsc_token")}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading dashboard...</p>;
  if (!stats) return <p className="text-red-500">Failed to load stats</p>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Programs", value: stats.totalPrograms, icon: BookOpen, color: "text-green-500" },
    { label: "Applications", value: stats.totalApplications, icon: FileText, color: "text-purple-500" },
    { label: "Approved", value: stats.applicationsByStatus?.APPROVED || 0, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Under Review", value: stats.applicationsByStatus?.UNDER_REVIEW || 0, icon: Clock, color: "text-yellow-500" },
    { label: "Rejected", value: stats.applicationsByStatus?.REJECTED || 0, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center gap-4">
              <card.icon size={28} className={card.color} />
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
