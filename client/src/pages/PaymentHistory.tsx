import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Smartphone, Banknote, ShieldCheck, Receipt, Loader2, Download, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useSEO, SEO } from '@/hooks/useSEO';

interface PaymentRecord {
  id: string;
  name: string;
  email: string;
  paymentRef: string | null;
  paymentChannel: string | null;
  paymentStatus: string | null;
  paymentAmount: number | null;
  paidAt: string | null;
  program: { title: string } | null;
  submittedAt: string;
}

export default function PaymentHistory() {
  useSEO(SEO.apply);

  const [email, setEmail] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  const handleLookup = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/payments/lookup?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Lookup failed');
      }

      setPayments(data.payments);
      if (data.payments.length === 0) {
        toast.info('No payments found for this email');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to lookup payments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (ref: string) => {
    setReceiptLoading(true);
    try {
      const res = await fetch(`/api/payments/receipt/${ref}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch receipt');
      }

      setReceiptData(data.receipt);
      setSelectedPayment(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load receipt');
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleSendReceipt = async () => {
    if (!receiptData) return;
    setSendingReceipt(true);
    try {
      const res = await fetch('/api/payments/receipt/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: receiptData.reference, email }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send receipt');
      }

      toast.success('Receipt sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send receipt');
    } finally {
      setSendingReceipt(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const channelIcon = (ch: string | null) => {
    if (!ch) return <ShieldCheck size={16} />;
    if (ch.includes('momo')) return <Smartphone size={16} className="text-green-600" />;
    if (ch.includes('card')) return <Banknote size={16} className="text-blue-600" />;
    return <ShieldCheck size={16} />;
  };

  const channelLabel = (ch: string | null) => {
    if (!ch) return 'N/A';
    if (ch.includes('momo')) return 'Mobile Money';
    if (ch.includes('card')) return 'Card';
    return ch;
  };

  const paymentStatusBadge = (status: string | null) => {
    if (status === 'PAID' || status === 'VERIFIED') {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Paid</span>;
    }
    if (status === 'REFUNDED') {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Refunded</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Unpaid</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <section className="py-20 bg-muted border-b">
        <div className="container text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Payment History</h1>
          <p className="text-xl text-muted-foreground">
            Look up your past payments and download receipts
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-2xl mx-auto">
          {!payments ? (
            <Card className="card-spiritual p-8">
              <h2 className="text-2xl font-bold mb-6">Find Your Payments</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                    placeholder="Enter the email you used to apply"
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-input focus:border-accent focus:outline-none"
                  />
                </div>
                <Button onClick={handleLookup} disabled={loading} className="btn-primary w-full">
                  {loading ? <><Loader2 className="animate-spin mr-2" size={18} /> Searching...</> : <><Search className="mr-2" size={18} /> Search Payments</>}
                </Button>
              </div>
            </Card>
          ) : payments.length === 0 ? (
            <div className="text-center">
              <Card className="card-spiritual p-8">
                <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Payments Found</h2>
                <p className="text-muted-foreground mb-6">
                  No payments were found for <strong>{email}</strong>. If you believe this is an error, please contact us.
                </p>
                <Button onClick={() => setPayments(null)} className="btn-outline">Search Again</Button>
              </Card>
              <div className="mt-6">
                <Link href="/apply" className="text-accent hover:underline">Apply for Admission</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Payments for <span className="text-accent">{email}</span></h2>
                <Button onClick={() => setPayments(null)} className="btn-outline text-sm">New Search</Button>
              </div>

              {payments.map((p, i) => (
                <Card key={i} className="card-spiritual p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{p.program?.title || 'Application'}</h3>
                      <p className="text-sm text-muted-foreground">{p.name}</p>
                    </div>
                    {paymentStatusBadge(p.paymentStatus)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">GHS {p.paymentAmount?.toFixed(2) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Channel</p>
                      <p className="font-semibold flex items-center gap-1">
                        {channelIcon(p.paymentChannel)} {channelLabel(p.paymentChannel)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reference</p>
                      <p className="font-mono text-xs">{p.paymentRef || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-semibold">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : new Date(p.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {p.paymentRef && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => handleViewReceipt(p.paymentRef!)}
                        disabled={receiptLoading}
                        className="btn-primary flex-1 text-sm"
                      >
                        <Receipt size={16} className="mr-1" /> View Receipt
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptData} onOpenChange={() => setReceiptData(null)}>
        <DialogContent className="max-w-lg">
          {receiptData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt size={20} /> Payment Receipt
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-lg">Payment Successful</h3>
                  <p className="text-sm text-muted-foreground">{receiptData.receiptNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-semibold">{receiptData.customer.name || receiptData.customer.email}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(receiptData.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold">{receiptData.currency} {receiptData.amount.toFixed(2)}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-semibold capitalize">{receiptData.channel}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg col-span-2">
                    <p className="text-muted-foreground">Transaction Reference</p>
                    <p className="font-mono text-xs break-all">{receiptData.reference}</p>
                  </div>
                  {receiptData.authorization?.last4 && (
                    <div className="bg-muted p-3 rounded-lg col-span-2">
                      <p className="text-muted-foreground">Card</p>
                      <p className="font-semibold">**** {receiptData.authorization.last4} {receiptData.authorization.cardType && `(${receiptData.authorization.cardType})`}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePrintReceipt} className="btn-outline flex-1">
                    <Download size={16} className="mr-2" /> Print
                  </Button>
                  <Button onClick={handleSendReceipt} disabled={sendingReceipt} className="btn-primary flex-1">
                    {sendingReceipt ? <><Loader2 className="animate-spin mr-2" size={16} /> Sending...</> : 'Send to Email'}
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
