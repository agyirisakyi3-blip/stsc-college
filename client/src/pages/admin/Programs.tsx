import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Program {
  id: string;
  title: string;
  summary: string;
  department: string;
  duration: string;
  instructor: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "", summary: "", fullDescription: "", department: "", duration: "",
  prerequisites: "", thumbnail: "", instructor: "Faculty Board", capacity: 50,
  startDate: "", schedule: "", outcomes: "[]",
};

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("stsc_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/programs", { headers })
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => toast.error("Failed to load programs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Program) => {
    const f = { ...emptyForm, ...p, capacity: p.capacity || 50 };
    setEditing(p);
    setForm(f);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/programs/${editing.id}`, { method: "PUT", headers, body: JSON.stringify(form) });
        toast.success("Program updated");
      } else {
        await fetch("/api/admin/programs", { method: "POST", headers, body: JSON.stringify(form) });
        toast.success("Program created");
      }
      setDialogOpen(false);
      load();
    } catch { toast.error("Failed to save program"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    try {
      await fetch(`/api/admin/programs/${id}`, { method: "DELETE", headers });
      toast.success("Program deleted");
      load();
    } catch { toast.error("Failed to delete program"); }
  };

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && programs.length === 0) return <p className="text-muted-foreground">Loading programs...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Button onClick={openCreate} className="btn-primary">
          <Plus size={16} className="mr-2" /> Add Program
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-sm">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Instructor</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{p.title}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{p.department}</td>
                  <td className="py-3 px-4 text-sm">{p.duration}</td>
                  <td className="py-3 px-4 text-sm">{p.instructor}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-accent hover:text-accent/80 mr-3" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Program" : "Add Program"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[
              ["title", "Title", "text"],
              ["summary", "Summary", "text"],
              ["fullDescription", "Full Description", "textarea"],
              ["department", "Department", "text"],
              ["duration", "Duration", "text"],
              ["prerequisites", "Prerequisites", "text"],
              ["instructor", "Instructor", "text"],
              ["schedule", "Schedule", "text"],
              ["startDate", "Start Date", "text"],
            ].map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                {type === "textarea" ? (
                  <textarea value={form[key as keyof typeof form] as string} onChange={(e) => update(key, e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:border-accent focus:outline-none text-sm" />
                ) : (
                  <input type="text" value={form[key as keyof typeof form] as string} onChange={(e) => update(key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:border-accent focus:outline-none text-sm" />
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => update("capacity", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:border-accent focus:outline-none text-sm" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="btn-primary w-full">
              {saving ? "Saving..." : editing ? "Update Program" : "Create Program"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
