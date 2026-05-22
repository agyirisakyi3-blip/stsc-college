import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, Trash2, CheckCircle, Clock, Smartphone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  bio: string;
  education: string;
  resumePath?: string;
  status: string;
  aiScore?: number;
  aiSummary?: string;
  aiConcerns?: string;
  aiReply?: string;
  submittedAt: string;
  paymentRef?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  paidAt?: string;
}

const STATUSES = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Application | null>(null);
  const token = localStorage.getItem("stsc_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const load = useCallback(() => {
    setLoading(true);
    const url = filter === "ALL" ? "/api/admin/applications" : `/api/admin/applications?status=${filter}`;
    fetch(url, { headers })
      .then((r) => r.json())
      .then(setApps)
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/applications/${id}`, { method: "PUT", headers, body: JSON.stringify({ status }) });
      toast.success(`Status updated to ${status}`);
      load();
      setSelected(null);
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    try {
      await fetch(`/api/admin/applications/${id}`, { method: "DELETE", headers });
      toast.success("Application deleted");
      load();
      setSelected(null);
    } catch { toast.error("Failed to delete"); }
  };

  const exportReply = (app: Application) => {
    const text = `To: ${app.email}\nSubject: Application Status - ${app.courseTitle}\n\n${app.aiReply || ""}`;
    const el = document.createElement("a");
    el.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
    el.download = `reply-${app.id}.txt`;
    el.click();
    toast.success("Reply exported");
  };

  if (loading && apps.length === 0) return <p className="text-muted-foreground">Loading applications...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {["ALL", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Score</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{a.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{a.courseTitle}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === "APPROVED" ? "bg-green-100 text-green-700" : a.status === "REJECTED" ? "bg-red-100 text-red-700" : a.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{a.aiScore != null ? `${a.aiScore}%` : "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-700" :
                      a.paymentStatus === "PAID" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      <Smartphone size={10} />
                      {a.paymentStatus === "VERIFIED" ? "Verified" : a.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => setSelected(a)} className="text-accent hover:text-accent/80" title="View">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["Course", selected.courseTitle],
                    ["Submitted", new Date(selected.submittedAt).toLocaleDateString()],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-medium">{val}</p>
                    </div>
                  ))}
                </div>

                {selected.bio && <div><h3 className="font-semibold text-sm mb-1">Bio</h3><p className="text-sm text-muted-foreground">{selected.bio}</p></div>}
                {selected.education && <div><h3 className="font-semibold text-sm mb-1">Education</h3><p className="text-sm text-muted-foreground">{selected.education}</p></div>}

                <div>
                  <h3 className="font-semibold text-sm mb-2">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selected.status === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {selected.paymentRef && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Smartphone size={14} className="text-green-600" /> Payment
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Ref:</span> {selected.paymentRef}</p>
                      <p><span className="text-muted-foreground">Amount:</span> GHS {selected.paymentAmount || 50}.00</p>
                      <p><span className="text-muted-foreground">Status:</span> {selected.paymentStatus}</p>
                      {selected.paidAt && <p><span className="text-muted-foreground">Verified:</span> {new Date(selected.paidAt).toLocaleDateString()}</p>}
                    </div>
                    {selected.paymentStatus !== "VERIFIED" && (
                      <Button size="sm" onClick={async () => {
                        try {
                          await fetch(`/api/admin/applications/${selected.id}`, {
                            method: "PUT",
                            headers,
                            body: JSON.stringify({ paymentStatus: "VERIFIED" }),
                          });
                          toast.success("Payment verified");
                          load();
                          setSelected(null);
                        } catch { toast.error("Failed to verify payment"); }
                      }} className="mt-3 bg-green-600 hover:bg-green-700 text-white text-xs">
                        <ShieldCheck size={12} className="mr-1" /> Verify Payment
                      </Button>
                    )}
                  </div>
                )}

                {selected.aiSummary && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <CheckCircle size={14} className="text-accent" /> AI Analysis
                    </h3>
                    {selected.aiScore != null && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: `${selected.aiScore}%` }} />
                        </div>
                        <span className="text-sm font-bold">{selected.aiScore}%</span>
                      </div>
                    )}
                    <p className="text-sm">{selected.aiSummary}</p>
                    {selected.aiConcerns && (
                      <ul className="text-sm mt-2 space-y-1">
                        {JSON.parse(selected.aiConcerns).map((c: string, i: number) => (
                          <li key={i} className="flex items-start gap-1"><Clock size={12} className="mt-0.5 shrink-0" />{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => exportReply(selected)} className="btn-primary flex-1">
                    <Download size={14} className="mr-1" /> Export Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(selected.id)} className="flex-1">
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
