import { Link } from 'wouter';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, Music2 } from 'lucide-react';

/**
 * Footer Component
 *
 * Design Philosophy: Modern Spiritual Minimalism
 * - Clean footer with organized sections
 * - Contact information and links
 * - Social media icons
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <img src="/images/stsc logo.jpeg" alt="STSC Logo" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg mb-4 text-accent">SUCCESS THEOLOGICAL SEMINARY AND COLLEGE</h3>
            <p className="text-sm opacity-90 mb-6">
              Empowering spiritual growth through comprehensive biblical education and community-focused learning.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300" aria-label="X (Twitter)">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300" aria-label="TikTok">
                <Music2 size={18} />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300" aria-label="Telegram">
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Courses</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-accent transition-colors">Theology</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Biblical Studies</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Apostolic Ministry</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Prophetic College</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Counseling &amp; Music</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+233257077972" className="hover:text-accent transition-colors">+233 257 077 972</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:info@successtheological.edu" className="hover:text-accent transition-colors">
                  info@successtheological.edu
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Kasoa-Nyanyano, Teshie,<br />Kumasi, Ho &amp; more</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
            <p>&copy; {currentYear} SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/contact" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
