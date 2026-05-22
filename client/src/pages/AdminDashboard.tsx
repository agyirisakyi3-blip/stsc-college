import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Eye, Trash2, Download, Smartphone, Banknote, ShieldCheck, RotateCcw, BarChart3, PieChart, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
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
  paymentRef?: string;
  paymentChannel?: string;
  paymentStatus?: string;
  paymentAmount?: number;
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [refunding, setRefunding] = useState(false);

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

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/payments/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch {
      // analytics best-effort
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleRefund = async (reference: string) => {
    if (!confirm('Are you sure you want to refund this payment?')) return;
    setRefunding(true);
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Refund failed');
      }
      toast.success('Refund processed successfully');
      loadApplications();
      if (analytics) loadAnalytics();
    } catch (error: any) {
      toast.error(error.message || 'Refund failed');
    } finally {
      setRefunding(false);
    }
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
    underReview: applications.filter(a => a.status === 'Under Review').length,
    paid: applications.filter(a => a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED' || a.paymentRef).length,
    pending: applications.filter(a => !a.paymentRef).length,
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.total}</p>
              <p className="text-muted-foreground">Total</p>
            </Card>
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-green-500 mb-2">{stats.approved}</p>
              <p className="text-muted-foreground">Approved</p>
            </Card>
            <Card className="card-spiritual p-6 text-center">
              <p className="text-4xl font-bold text-yellow-500 mb-2">{stats.underReview}</p>
              <p className="text-muted-foreground">Under Review</p>
            </Card>
            <Card className="card-spiritual p-6 text-center bg-green-50 border-green-200">
              <p className="text-4xl font-bold text-green-600 mb-2">{stats.paid}</p>
              <p className="text-muted-foreground">Paid</p>
            </Card>
            <Card className="card-spiritual p-6 text-center bg-yellow-50 border-yellow-200">
              <p className="text-4xl font-bold text-yellow-600 mb-2">{stats.pending}</p>
              <p className="text-muted-foreground">Payment Pending</p>
            </Card>
          </div>

          {/* Analytics Toggle */}
          <div className="mb-6">
            <Button
              onClick={() => {
                setShowAnalytics(!showAnalytics);
                if (!showAnalytics && !analytics) loadAnalytics();
              }}
              className="btn-outline"
            >
              <BarChart3 size={18} className="mr-2" />
              {showAnalytics ? 'Hide Analytics' : 'Show Payment Analytics'}
            </Button>
          </div>

          {showAnalytics && (
            <div className="mb-8">
              {analyticsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span>Loading analytics...</span>
                </div>
              ) : analytics ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-3xl font-bold text-accent">{analytics.total}</p>
                      <p className="text-sm text-muted-foreground">Total Apps</p>
                    </Card>
                    <Card className="p-4 text-center bg-green-50 border-green-200">
                      <p className="text-3xl font-bold text-green-600">{analytics.paid}</p>
                      <p className="text-sm text-muted-foreground">Paid</p>
                    </Card>
                    <Card className="p-4 text-center bg-red-50 border-red-200">
                      <p className="text-3xl font-bold text-red-600">{analytics.unpaid}</p>
                      <p className="text-sm text-muted-foreground">Unpaid</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-3xl font-bold text-accent">GHS {analytics.totalRevenue.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Monthly Revenue Chart */}
                    <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} /> Monthly Revenue
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analytics.monthly}>
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#8B0000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Channel Breakdown */}
                    <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <PieChart size={18} /> Payment Channels
                      </h3>
                      {analytics.channelBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <RePieChart>
                            <Pie
                              data={analytics.channelBreakdown}
                              dataKey="count"
                              nameKey="channel"
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              label={({ channel, count }) => `${channel}: ${count}`}
                            >
                              {analytics.channelBreakdown.map((_: any, i: number) => (
                                <Cell key={i} fill={['#8B0000', '#16a34a', '#2563eb', '#d97706'][i % 4]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground text-sm py-8 text-center">No payment data yet</p>
                      )}
                    </Card>
                  </div>

                  {/* Monthly Volume Chart */}
                  <Card className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BarChart3 size={18} /> Monthly Payment Volume
                    </h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={analytics.monthly}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Failed to load analytics</p>
              )}
            </div>
          )}

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
                    <th className="text-left py-4 px-4 font-bold">Payment</th>
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
                      {app.paymentRef ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <Smartphone size={12} />
                          {app.paymentChannel?.includes('momo') ? 'MoMo' : app.paymentChannel || 'Paid'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Unpaid
                        </span>
                      )}
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
                  {selectedApp.paymentRef && (
                    <>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Payment Ref</p>
                        <p className="font-semibold text-sm font-mono">{selectedApp.paymentRef}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Payment Channel</p>
                        <p className="font-semibold text-sm flex items-center gap-1">
                          {selectedApp.paymentChannel?.includes('momo') ? (
                            <><Smartphone size={14} className="text-green-600" /> Mobile Money</>
                          ) : selectedApp.paymentChannel?.includes('card') ? (
                            <><Banknote size={14} className="text-blue-600" /> Card</>
                          ) : (
                            <><ShieldCheck size={14} className="text-green-600" /> {selectedApp.paymentChannel || 'Verified'}</>
                          )}
                        </p>
                      </div>
                    </>
                  )}
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
                  {selectedApp.paymentRef && selectedApp.paymentStatus !== 'REFUNDED' && (
                    <Button
                      onClick={() => handleRefund(selectedApp.paymentRef!)}
                      disabled={refunding}
                      className="bg-orange-600 hover:bg-orange-700 text-white border-none flex-1"
                    >
                      <RotateCcw size={18} className="mr-2" />
                      {refunding ? 'Refunding...' : 'Refund'}
                    </Button>
                  )}
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
