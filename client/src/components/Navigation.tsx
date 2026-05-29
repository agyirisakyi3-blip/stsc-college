import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Twitter, Music2, Send } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    {
      label: 'Programs',
      href: '#',
      dropdown: [
        { label: 'All Courses', href: '/courses' },
        { label: 'Theology', href: '/courses' },
        { label: 'Biblical Studies', href: '/courses' },
        { label: 'Apostolic Ministry', href: '/courses' },
        { label: 'Prophetic College', href: '/courses' },
        { label: 'Counseling & Music', href: '/courses' },
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-secondary text-secondary-foreground text-sm">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="tel:+233257077972" className="flex items-center gap-1.5 hover:text-ring transition-colors">
              <Phone size={14} /> +233 257 077 972
            </a>
            <a href="mailto:info@successtheological.edu" className="flex items-center gap-1.5 hover:text-ring transition-colors">
              <Mail size={14} /> info@successtheological.edu
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-ring transition-colors" aria-label="Facebook"><Facebook size={14} /></a>
            <a href="#" className="hover:text-ring transition-colors" aria-label="Instagram"><Instagram size={14} /></a>
            <a href="#" className="hover:text-ring transition-colors" aria-label="Twitter"><Twitter size={14} /></a>
            <a href="#" className="hover:text-ring transition-colors" aria-label="TikTok"><Music2 size={14} /></a>
            <a href="#" className="hover:text-ring transition-colors" aria-label="Telegram"><Send size={14} /></a>
            <span className="text-secondary-foreground/40 mx-1">|</span>
            <a href="/apply" className="hover:text-ring transition-colors font-medium">Admission Portal</a>
            <a href="/login" className="hover:text-ring transition-colors font-medium">Student Portal</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all shrink-0">
              <img src="/images/stsc logo.jpeg" alt="STSC Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-accent">STSC</span>
              <span className="text-[10px] font-medium text-secondary -mt-1 tracking-wider uppercase leading-tight">Success Theological Seminary & College</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="px-4 py-2 text-foreground hover:text-accent font-medium rounded-lg hover:bg-muted transition-all flex items-center gap-1"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />}
                </Link>
                {item.dropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdown.map((dropItem) => (
                        <Link
                          key={dropItem.label}
                          href={dropItem.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-muted transition-colors"
                        >
                          {dropItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/apply" className="ml-4 btn-primary text-sm px-6 py-2.5">
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <div className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                        className="w-full flex items-center justify-between text-foreground font-medium py-2.5 px-4 rounded-lg hover:bg-muted transition-colors"
                      >
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${mobileProgramsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileProgramsOpen && (
                        <div className="ml-4 flex flex-col gap-1 pb-2">
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.label}
                              href={dropItem.href}
                              className="px-4 py-2 text-sm text-muted-foreground hover:text-accent rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {dropItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-foreground font-medium py-2.5 px-4 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link href="/apply" className="btn-primary text-center mt-2" onClick={() => setIsOpen(false)}>
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
