import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';

/**
 * Navigation Component
 *
 * Design Philosophy: Modern Spiritual Minimalism
 * - Clean, minimal design with soft teal accents
 * - Responsive mobile-first navigation
 * - Smooth transitions and hover effects
 * - 3D elevated bar effect
 */
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Contact', href: '/contact' },
    { label: 'Apply', href: '/apply' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b-4 border-secondary/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-accent hover:text-accent/80 transition-colors">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/images/stsc logo.jpeg" alt="STSC Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="hidden sm:inline font-bold tracking-tight">STSC</span>
            <span className="hidden sm:inline text-[8px] font-medium text-secondary -mt-1 tracking-wider uppercase">Raising spotless leaders for global impact</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-accent transition-all duration-300 font-semibold relative py-2 px-4 rounded-lg hover:bg-muted hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-accent transition-colors font-medium py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
