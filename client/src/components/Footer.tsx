import { Link } from 'wouter';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, Music2, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-ring/30 mb-5">
              <img src="/images/stsc logo.jpeg" alt="STSC Logo" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-ring">SUCCESS THEOLOGICAL SEMINARY AND COLLEGE</h3>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed mb-6">
              Born out of passion to raise unquestionable leaders that can move beyond their jurisdiction to impact their generation for God and community.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-secondary-foreground/10 rounded-lg hover:bg-ring hover:text-accent transition-all duration-300" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2.5 bg-secondary-foreground/10 rounded-lg hover:bg-ring hover:text-accent transition-all duration-300" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2.5 bg-secondary-foreground/10 rounded-lg hover:bg-ring hover:text-accent transition-all duration-300" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2.5 bg-secondary-foreground/10 rounded-lg hover:bg-ring hover:text-accent transition-all duration-300" aria-label="TikTok">
                <Music2 size={16} />
              </a>
              <a href="#" className="p-2.5 bg-secondary-foreground/10 rounded-lg hover:bg-ring hover:text-accent transition-all duration-300" aria-label="Telegram">
                <Send size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-ring rounded-full inline-block"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Courses', href: '/courses' },
                { label: 'Contact', href: '/contact' },
                { label: 'Apply Now', href: '/apply' },
                { label: 'Payment History', href: '/payment-history' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-ring transition-colors group">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-ring rounded-full inline-block"></span>
              Our Programs
            </h4>
            <ul className="space-y-3">
              {[
                'Theology',
                'Biblical Studies',
                'Apostolic Ministry',
                'Prophetic College',
                'Counseling & Music',
                'Church Administration',
              ].map((program) => (
                <li key={program}>
                  <Link href="/courses" className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-ring transition-colors group">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-ring rounded-full inline-block"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-ring/20 rounded-lg shrink-0">
                  <Phone size={16} className="text-ring" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground/60 mb-0.5">Phone</p>
                  <a href="tel:+233257077972" className="text-sm hover:text-ring transition-colors">+233 257 077 972</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-ring/20 rounded-lg shrink-0">
                  <Mail size={16} className="text-ring" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground/60 mb-0.5">Email</p>
                  <a href="mailto:info@successtheological.edu" className="text-sm hover:text-ring transition-colors">info@successtheological.edu</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-ring/20 rounded-lg shrink-0">
                  <MapPin size={16} className="text-ring" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground/60 mb-0.5">Campuses</p>
                  <p className="text-sm">Kasoa-Nyanyano, Teshie,<br />Kumasi, Ho & more</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
            <p>&copy; {currentYear} SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/contact" className="hover:text-ring transition-colors">Privacy Policy</Link>
              <a href="#" className="hover:text-ring transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-ring transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
