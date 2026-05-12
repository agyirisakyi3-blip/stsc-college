import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useSEO, SEO } from '@/hooks/useSEO';

/**
 * Contact Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - Contact form with validation
 * - Contact information
 * - Google Maps placeholder
 * - Accessible form design
 */
export default function Contact() {
  useSEO(SEO.contact);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      // Save locally as fallback
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      messages.push(payload);
      localStorage.setItem('contactMessages', JSON.stringify(messages));

      // Send to server for email notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+233 257 077 972',
      subtext: 'Mon-Fri, 9:00 AM - 5:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@successtheological.edu',
      subtext: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Faith Street',
      subtext: 'Spiritual City, SC 12345'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Monday - Friday',
      subtext: '9:00 AM - 5:00 PM EST'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-muted border-b">
        <div className="container text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have questions about our courses or programs? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="card-spiritual text-center p-6">
                  <Icon className="w-8 h-8 text-accent mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{info.title}</h3>
                  <p className="font-semibold text-sm mb-1">{info.content}</p>
                  <p className="text-xs text-muted-foreground">{info.subtext}</p>
                </Card>
              );
            })}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Your name"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.name
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                    aria-label="Full Name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
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
                    aria-label="Email Address"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.subject
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                    aria-label="Subject"
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
                      errors.message
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input focus:border-accent focus:outline-none'
                    }`}
                    aria-label="Message"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Visit Us</h2>
              <div className="bg-muted rounded-lg overflow-hidden h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-accent mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    SUCCESS THEOLOGICAL SEMINARY AND COLLEGE<br />
                    123 Faith Street<br />
                    Spiritual City, SC 12345
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive map would appear here
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <Card className="card-spiritual mt-8 p-6">
                <h3 className="font-bold mb-4">Parking & Accessibility</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our facility offers ample free parking and is fully accessible to individuals with disabilities. Accessible restrooms and elevators are available throughout the building.
                </p>
                <p className="text-muted-foreground text-sm">
                  If you need any accommodations, please let us know in your message or call ahead.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
