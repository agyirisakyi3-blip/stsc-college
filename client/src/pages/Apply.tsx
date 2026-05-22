import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Upload, Smartphone, Banknote, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import coursesData from '@/data/courses.json';
import { analyzeApplication, ApplicationData } from '@/lib/manus';
import { toast } from 'sonner';
import { useSEO, SEO } from '@/hooks/useSEO';

const ADMISSION_FEE = 100;
const MOMO_NUMBER = import.meta.env.VITE_MOMO_NUMBER || "233257077972";
const MOMO_NAME = import.meta.env.VITE_MOMO_NAME || "Success Theological Seminary";
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
const MOMO_NETWORKS = [
  { id: "mtn", label: "MTN Mobile Money", code: "*170#" },
  { id: "vodafone", label: "Vodafone Cash", code: "*110#" },
  { id: "airteltigo", label: "AirtelTigo Money", code: "*888#" },
];

/**
 * Application Portal Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - Multi-step application form
 * - Course selection
 * - File upload with validation
 * - Manus AI integration for application analysis
 * - Success confirmation
 */
export default function Apply() {
  useSEO(SEO.apply);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: '',
    bio: '',
    education: '',
    resume: null as File | null,
    agreement: false,
    paymentRef: '',
    paymentChannel: '',
    paymentNetwork: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'direct_momo' | ''>('');
  const [directChargeStatus, setDirectChargeStatus] = useState('');

  const courses = coursesData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
        return;
      }
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
        return;
      }
      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) newErrors.courseId = 'Please select a course';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    else if (formData.bio.trim().length < 20) newErrors.bio = 'Bio must be at least 20 characters';
    if (!formData.education.trim()) newErrors.education = 'Education is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentVerified && !formData.paymentRef.trim()) {
      newErrors.paymentRef = 'Please complete the payment to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreement) newErrors.agreement = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayWithPaystack = async (channel: 'momo' | 'card') => {
    if (channel === 'momo' && !formData.paymentNetwork) {
      toast.error('Please select your mobile money network');
      return;
    }

    setIsPaying(true);
    setPaymentMethod(channel);

    try {
      const body: any = {
        email: formData.email,
        amount: ADMISSION_FEE,
        metadata: {
          applicant_name: formData.name,
          applicant_phone: formData.phone,
          source: 'stsc-college',
        },
      };

      if (channel === 'momo') {
        body.phone = formData.phone;
        body.network = formData.paymentNetwork;
      }

      const endpoint = channel === 'momo' ? '/api/payments/initialize-momo' : '/api/payments/initialize';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      if (channel === 'card') {
        window.location.href = data.authorizationUrl;
        return;
      }

      setFormData(prev => ({ ...prev, paymentRef: data.reference }));
      setPaymentVerified(true);
      setFormData(prev => ({ ...prev, paymentChannel: `momo_${formData.paymentNetwork}` }));
      toast.success('Payment initiated! Complete the payment on your phone.');
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
      setPaymentMethod('');
    } finally {
      setIsPaying(false);
    }
  };

  const handleDirectMoMoCharge = async () => {
    if (!formData.paymentNetwork) {
      toast.error('Please select your mobile money network');
      return;
    }

    setIsPaying(true);
    setPaymentMethod('direct_momo');

    try {
      const res = await fetch('/api/payments/charge-momo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount: ADMISSION_FEE,
          phone: formData.phone,
          network: formData.paymentNetwork,
          metadata: {
            applicant_name: formData.name,
            applicant_phone: formData.phone,
            source: 'stsc-college',
          },
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate charge');
      }

      setFormData(prev => ({ ...prev, paymentRef: data.reference }));
      setDirectChargeStatus('Payment request sent to your phone. Enter the MoMo PIN on your phone to complete.');
      toast.success('Payment request sent! Check your phone.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send payment request');
    } finally {
      setIsPaying(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!formData.paymentRef) return;

    setIsPaying(true);
    try {
      const res = await fetch(`/api/payments/verify/${formData.paymentRef}`);
      const data = await res.json();

      if (data.verified) {
        setPaymentVerified(true);
        setFormData(prev => ({ ...prev, paymentChannel: data.channel || prev.paymentChannel }));
        toast.success('Payment verified successfully!');
      } else {
        toast.error('Payment not yet confirmed. Please try again after completing payment.');
      }
    } catch {
      toast.error('Failed to verify payment');
    } finally {
      setIsPaying(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep4()) {
      toast.error('Please agree to the terms before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get selected course
      const selectedCourse = courses.find(c => c.id === formData.courseId);

      // Call Manus AI to analyze application
      const analysis = await analyzeApplication(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          courseId: formData.courseId,
          bio: formData.bio,
          education: formData.education
        },
        selectedCourse?.title || 'Unknown Course'
      );

      setAiAnalysis(analysis);

      // Store application in localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const appId = `APP-${Date.now()}`;

      // Read resume as base64
      let resumeBase64: string | null = null;
      const resumeFile = formData.resume;
      if (resumeFile) {
        resumeBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(resumeFile);
        });
      }

      const appRecord = {
        id: appId,
        ...formData,
        resume: formData.resume?.name,
        courseTitle: selectedCourse?.title,
        aiAnalysis: analysis,
        submittedAt: new Date().toISOString(),
        status: analysis.score >= 75 ? 'Approved' : 'Under Review',
      };

      const paymentChannel = formData.paymentChannel || (paymentVerified ? 'verified' : '');

      applications.push(appRecord);
      localStorage.setItem('applications', JSON.stringify(applications));
      setApplicationId(appId);

      // Submit to DB
      const dbRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          courseTitle: selectedCourse?.title,
          bio: formData.bio,
          education: formData.education,
          aiScore: analysis.score,
          aiSummary: analysis.summary,
          aiConcerns: analysis.concerns,
          paymentRef: formData.paymentRef,
          paymentChannel: paymentChannel,
        }),
      });

      if (!dbRes.ok) {
        const errData = await dbRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit to database');
      }

      const dbData = await dbRes.json();

      // Submit to server for email notification + Google Sheets backup
      fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dbData.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          courseId: formData.courseId,
          courseTitle: selectedCourse?.title,
          bio: formData.bio,
          education: formData.education,
          resumeFileName: formData.resume?.name || null,
          resumeBase64,
          submittedAt: new Date().toISOString(),
          status: analysis.score >= 75 ? 'Approved' : 'Under Review',
          aiScore: analysis.score,
          aiSummary: analysis.summary,
          aiConcerns: analysis.concerns,
          paymentRef: formData.paymentRef,
        }),
      }).catch((err) => console.error('Server submission failed:', err));

      setStep(5);

      // Email Content Construction
      const emailSubject = `New Admission Application - ${formData.name} (${dbData.id})`;
      const emailBody = `Dear Admissions Team,\n\nI have submitted an application for the following course: ${selectedCourse?.title}.\n\nApplication Details:\n- Name: ${formData.name}\n- Email: ${formData.email}\n- Phone: ${formData.phone}\n- ID: ${dbData.id}\n- Payment Ref: ${formData.paymentRef}\n\nKind regards,\n${formData.name}`;
      
      const mailtoUrl = `mailto:info@successtheological.edu?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      (window as any).lastMailtoUrl = mailtoUrl;

      toast.success('Application submitted successfully');

      // Construct WhatsApp Message
      const whatsappMessage = `Hello *SUCCESS THEOLOGICAL SEMINARY AND COLLEGE Admissions*,\n\nI have just submitted my application.\n\n*Application Details:*\n- *ID:* ${dbData.id}\n- *Name:* ${formData.name}\n- *Course:* ${selectedCourse?.title}\n- *Email:* ${formData.email}\n- *Phone:* ${formData.phone}\n- *Payment Ref:* ${formData.paymentRef}\n\nPlease let me know the next steps. Thank you!`;
      
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/233257077972?text=${encodedMessage}`;
      
      (window as any).lastWhatsappUrl = whatsappUrl;

    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === formData.courseId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-muted border-b">
        <div className="container text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Apply for Admission</h1>
          <p className="text-xl text-muted-foreground">
            Begin your spiritual learning journey at SUCCESS THEOLOGICAL SEMINARY AND COLLEGE today.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-background">
        <div className="container max-w-2xl">
          {/* 3D Portal Frame */}
          {/* Progress Indicator */}
          {step < 5 && (
            <div className="mb-12">
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                      s <= step ? 'bg-accent' : 'bg-muted'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-center text-muted-foreground">
                {step === 1 ? 'Personal Information' : step === 2 ? 'Course & Background' : step === 3 ? 'Payment' : 'Review & Submit'} — Step {step} of 4
              </p>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="card-spiritual p-10 border-t-4 border-l-4 border-b-8 border-r-8 border-t-accent border-l-accent/60 border-b-secondary border-r-secondary/70 shadow-[6px_8px_0px_0px_rgba(139,0,0,0.25),0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[8px_10px_0px_0px_rgba(139,0,0,0.35),0_25px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.name
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.phone
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleNext}
                    className="btn-primary flex-1"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Course & Background */}
          {step === 2 && (
            <Card className="card-spiritual p-10 border-t-4 border-l-4 border-b-8 border-r-8 border-t-accent border-l-accent/60 border-b-secondary border-r-secondary/70 shadow-[6px_8px_0px_0px_rgba(139,0,0,0.25),0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[8px_10px_0px_0px_rgba(139,0,0,0.35),0_25px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6">Course Selection & Background</h2>
              <div className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label htmlFor="courseId" className="block text-sm font-semibold mb-2">
                    Select Course *
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.courseId
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.level})
                      </option>
                    ))}
                  </select>
                  {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
                </div>

                {/* Course Info */}
                {selectedCourse && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Prerequisites:</p>
                    <p className="font-semibold">{selectedCourse.prerequisites || 'None'}</p>
                  </div>
                )}

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold mb-2">
                    Tell us about yourself *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share your background, interests, and why you're interested in biblical education..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
                      errors.bio
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className="block text-sm font-semibold mb-2">
                    Previous Education *
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Describe your educational background and any relevant experience..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
                      errors.education
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                  />
                  {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleBack}
                    className="btn-outline flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="btn-primary flex-1"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Card className="card-spiritual p-10 border-t-4 border-l-4 border-b-8 border-r-8 border-t-accent border-l-accent/60 border-b-secondary border-r-secondary/70 shadow-[6px_8px_0px_0px_rgba(139,0,0,0.25),0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[8px_10px_0px_0px_rgba(139,0,0,0.35),0_25px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6">Application Fee Payment</h2>
              <div className="space-y-6">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3">Admission Fee: <span className="text-accent">GHS {ADMISSION_FEE}.00</span></h3>
                  <p className="text-sm text-muted-foreground">
                    A non-refundable admission fee is required to process your application.
                    Choose your preferred payment method below.
                  </p>
                </div>

                {!paymentVerified ? (
                  <>
                    {/* Mobile Money Option */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Smartphone className="text-green-600" size={20} />
                        Pay with Mobile Money
                      </h3>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Select Network</label>
                        <div className="grid grid-cols-1 gap-2">
                          {MOMO_NETWORKS.map(net => (
                            <label
                              key={net.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                formData.paymentNetwork === net.id
                                  ? 'border-green-500 bg-green-100'
                                  : 'border-green-200 bg-white hover:border-green-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentNetwork"
                                value={net.id}
                                checked={formData.paymentNetwork === net.id}
                                onChange={handleChange}
                                className="accent-green-600"
                              />
                              <div>
                                <p className="font-semibold text-sm">{net.label}</p>
                                <p className="text-xs text-muted-foreground">Dial {net.code} to pay</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePayWithPaystack('momo')}
                        disabled={isPaying || !formData.paymentNetwork}
                        className="bg-green-600 hover:bg-green-700 text-white w-full border-none shadow-md"
                      >
                        {isPaying && paymentMethod === 'momo' ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Processing...</>
                        ) : (
                          <><Smartphone className="mr-2" size={18} /> Pay GHS {ADMISSION_FEE} with MoMo</>
                        )}
                      </Button>

                      <Button
                        onClick={handleDirectMoMoCharge}
                        disabled={isPaying || !formData.paymentNetwork}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white w-full border-none shadow-md mt-2"
                      >
                        {isPaying && paymentMethod === 'direct_momo' ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Sending request...</>
                        ) : (
                          <><Smartphone className="mr-2" size={18} /> Direct Charge to My Phone</>
                        )}
                      </Button>
                      {directChargeStatus && (
                        <p className="text-sm text-emerald-700 mt-2 bg-emerald-50 p-2 rounded">{directChargeStatus}</p>
                      )}

                      <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
                        <p className="text-xs text-muted-foreground">
                          <strong>Alternative:</strong> Send directly to <strong>{MOMO_NUMBER}</strong> (Name: {MOMO_NAME}),
                          then enter the reference below:
                        </p>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            name="paymentRef"
                            value={formData.paymentRef}
                            onChange={handleChange}
                            placeholder="Or enter reference manually"
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-border bg-input focus:border-accent focus:outline-none text-sm"
                          />
                          {formData.paymentRef && (
                            <Button
                              onClick={handleVerifyPayment}
                              disabled={isPaying}
                              className="bg-green-600 hover:bg-green-700 text-white border-none text-sm px-4"
                            >
                              {isPaying ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Option */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Banknote className="text-blue-600" size={20} />
                        Pay with Card / Bank Transfer
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely with your debit/credit card or bank transfer via Paystack.
                      </p>
                      <Button
                        onClick={() => handlePayWithPaystack('card')}
                        disabled={isPaying}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full border-none shadow-md"
                      >
                        {isPaying && paymentMethod === 'card' ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Redirecting...</>
                        ) : (
                          <><Banknote className="mr-2" size={18} /> Pay GHS {ADMISSION_FEE} with Card</>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-green-700 mb-2">Payment Received!</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Reference: <strong className="text-foreground">{formData.paymentRef}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your payment has been recorded. Click Next to continue.
                    </p>
                  </div>
                )}

                {errors.paymentRef && <p className="text-red-500 text-sm">{errors.paymentRef}</p>}

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleBack}
                    className="btn-outline flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!paymentVerified && !formData.paymentRef.trim()}
                    className="btn-primary flex-1"
                  >
                    {paymentVerified ? 'Next' : formData.paymentRef ? 'Next (Payment Entered)' : 'Complete Payment to Continue'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <Card className="card-spiritual p-10 border-t-4 border-l-4 border-b-8 border-r-8 border-t-accent border-l-accent/60 border-b-secondary border-r-secondary/70 shadow-[6px_8px_0px_0px_rgba(139,0,0,0.25),0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[8px_10px_0px_0px_rgba(139,0,0,0.35),0_25px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
              <div className="space-y-6">
                {/* Application Summary */}
                <div className="bg-muted p-6 rounded-lg space-y-4">
                  <h3 className="font-bold">Application Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-semibold">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-semibold">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Course</p>
                      <p className="font-semibold">{selectedCourse?.title}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Ref</p>
                      <p className="font-semibold text-green-700">{formData.paymentRef}</p>
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Upload Resume (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="font-semibold">Click to upload resume</p>
                      <p className="text-sm text-muted-foreground">PDF or Word document (max 5MB)</p>
                      {formData.resume && (
                        <p className="text-sm text-accent mt-2">✓ {formData.resume.name}</p>
                      )}
                    </label>
                  </div>
                  {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                </div>

                {/* Agreement Checkbox */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">I agree to the Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        I understand that my application will be reviewed and analyzed using AI assistance. My personal information will be kept confidential and used only for admissions purposes. I confirm that I have paid the admission fee of GHS {ADMISSION_FEE}.00.
                      </p>
                    </div>
                  </label>
                  {errors.agreement && <p className="text-red-500 text-sm mt-2">{errors.agreement}</p>}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleBack}
                    className="btn-outline flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <Card className="card-spiritual p-10 text-center border-t-4 border-l-4 border-b-8 border-r-8 border-t-accent border-l-accent/60 border-b-secondary border-r-secondary/70 shadow-[6px_8px_0px_0px_rgba(139,0,0,0.25),0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for applying to SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. Your application ID is:
              </p>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="font-mono font-bold text-lg">{applicationId}</p>
              </div>

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <div className="space-y-6 text-left mb-8">
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <CheckCircle size={20} className="text-accent" />
                      AI Application Analysis
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Fit Score</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all"
                              style={{ width: `${aiAnalysis.score}%` }}
                            ></div>
                          </div>
                          <p className="font-bold text-lg">{aiAnalysis.score}%</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Summary</p>
                        <p className="text-sm">{aiAnalysis.summary}</p>
                      </div>

                      {aiAnalysis.concerns && aiAnalysis.concerns.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            <AlertCircle size={16} />
                            Considerations
                          </p>
                          <ul className="text-sm space-y-1">
                            {aiAnalysis.concerns.map((concern: string, i: number) => (
                              <li key={i}>• {concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground mb-8">
                Your application has been logged and a notification has been sent to <strong>info@successtheological.edu</strong>. 
                We'll review your details and contact you within 5 business days.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="btn-outline flex-1 inline-flex items-center justify-center rounded-md font-medium transition-colors px-4 py-2">
                  Return to Home
                </Link>
                <Link href="/courses" className="btn-outline flex-1 inline-flex items-center justify-center rounded-md font-medium transition-colors px-4 py-2">
                  View More Courses
                </Link>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a 
                    href={(window as any).lastMailtoUrl || '#'} 
                    className="flex-1"
                  >
                    <Button className="btn-primary w-full shadow-sm">
                      Send Copy via Email
                    </Button>
                  </a>
                  <a 
                    href={(window as any).lastWhatsappUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full border-none shadow-md">
                      Message on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
