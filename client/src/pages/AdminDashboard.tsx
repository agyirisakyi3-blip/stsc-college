import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Eye, Trash2, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  bio: string;
  education: string;
  resume?: string;
  aiAnalysis: {
    summary: string;
    score: number;
    suggestedReply: string;
    concerns: string[];
  };
  submittedAt: string;
  status: string;
}

/**
 * Admin Dashboard Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - View all applications
 * - Filter by status
 * - View AI analysis
 * - Send suggested replies
 */
export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isPasswordOpen, setIsPasswordOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const loadApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setApplications(data);
          return;
        }
      }
    } catch {
      // fall back to localStorage
    }
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(apps);
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setIsPasswordOpen(false);
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    } catch {
      // server delete best-effort
    }
    const updated = applications.filter(app => app.id !== id);
    localStorage.setItem('applications', JSON.stringify(updated));
    setApplications(updated);
    setSelectedApp(null);
    toast.success('Application deleted');
  };

  const handleExportReply = (app: Application) => {
    const reply = app.aiAnalysis.suggestedReply;
    const text = `To: ${app.email}\nSubject: Application Status - ${app.courseTitle}\n\n${reply}`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `reply-${app.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Reply exported');
  };

  const filteredApplications = filterStatus === 'All'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const stats = {
    total: applications.length,
    approved: applications.filter(a => a.status === 'Approved').length,
    underReview: applications.filter(a => a.status === 'Under Review').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <Card className="card-spiritual p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-input focus:border-accent focus:outline-none"
                />
                <p className="text-xs text-muted-foreground mt-2">Demo password: admin123</p>
              </div>
              <Button onClick={handleLogin} className="btn-primary w-full">
                Login
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-muted border-b border-border">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage applications and AI insights</p>
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="btn-outline"
          >
            Logout
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.total}</p>
              <p className="text-muted-foreground">Total Applications</p>
            </Card>
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-green-500 mb-2">{stats.approved}</p>
              <p className="text-muted-foreground">Approved</p>
            </Card>
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-yellow-500 mb-2">{stats.underReview}</p>
              <p className="text-muted-foreground">Under Review</p>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['All', 'Approved', 'Under Review'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-foreground hover:bg-border'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-4 font-bold">Name</th>
                  <th className="text-left py-4 px-4 font-bold">Course</th>
                  <th className="text-left py-4 px-4 font-bold">Score</th>
                  <th className="text-left py-4 px-4 font-bold">Status</th>
                  <th className="text-left py-4 px-4 font-bold">Date</th>
                  <th className="text-left py-4 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-4 px-4">{app.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{app.courseTitle}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${app.aiAnalysis.score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-sm">{app.aiAnalysis.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-accent hover:text-accent/80 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No applications found</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Detail Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedApp.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold text-sm">{selectedApp.email}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold text-sm">{selectedApp.phone}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Course</p>
                    <p className="font-semibold text-sm">{selectedApp.courseTitle}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="font-semibold text-sm">
                      {new Date(selectedApp.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bio & Education */}
                <div>
                  <h3 className="font-bold mb-2">About Applicant</h3>
                  <p className="text-muted-foreground text-sm mb-4">{selectedApp.bio}</p>
                  <h3 className="font-bold mb-2">Education</h3>
                  <p className="text-muted-foreground text-sm">{selectedApp.education}</p>
                </div>

                {/* AI Analysis */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-accent" />
                    AI Analysis
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Fit Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div
                            className="bg-accent h-3 rounded-full transition-all"
                            style={{ width: `${selectedApp.aiAnalysis.score}%` }}
                          ></div>
                        </div>
                        <p className="font-bold text-lg">{selectedApp.aiAnalysis.score}%</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Summary</p>
                      <p className="text-sm">{selectedApp.aiAnalysis.summary}</p>
                    </div>

                    {selectedApp.aiAnalysis.concerns && selectedApp.aiAnalysis.concerns.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <AlertCircle size={16} />
                          Considerations
                        </p>
                        <ul className="text-sm space-y-1">
                          {selectedApp.aiAnalysis.concerns.map((concern, i) => (
                            <li key={i}>• {concern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Reply */}
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-bold mb-3">AI-Generated Reply Template</h3>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {selectedApp.aiAnalysis.suggestedReply}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleExportReply(selectedApp)}
                    className="btn-primary flex-1"
                  >
                    <Download size={18} className="mr-2" />
                    Export Reply
                  </Button>
                  <Button
                    onClick={() => handleDeleteApplication(selectedApp.id)}
                    className="btn-outline flex-1"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
