import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { BookOpen, Users, Award, ArrowRight, GraduationCap, BookMarked, Heart, Quote, ChevronLeft, ChevronRight, Star, MapPin, Calendar, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSEO, SEO } from '@/hooks/useSEO';

export default function Home() {
  useSEO(SEO.home);

  const heroImages = [
    "/images/Apostle Dr Asravor Dzigbordi Aku Selasi Success.jpeg",
    "/images/Campus.jpeg",
    "/images/Biblical Studies.jpeg",
    "/images/leadership.jpeg",
    "/images/Theologgy.jpeg",
    "/images/Prophetic.jpeg",
    "/images/Mission.jpeg",
    "/images/Church Administration.jpeg",
    "/images/Counseling.jpeg",
    "/images/Music .jpeg",
    "/images/Professor Emmanuel G Lanz.jpeg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ years: 0, programs: 0, students: 0, graduates: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const targets = { years: 20, programs: 42, students: 5000, graduates: 3000 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      years: targets.years / steps,
      programs: targets.programs / steps,
      students: targets.students / steps,
      graduates: targets.graduates / steps,
    };
    let current = { years: 0, programs: 0, students: 0, graduates: 0 };
    let step = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setInterval(() => {
            step++;
            if (step >= steps) {
              setCounts(targets);
              clearInterval(timer);
            } else {
              current = {
                years: Math.min(current.years + increment.years, targets.years),
                programs: Math.min(current.programs + increment.programs, targets.programs),
                students: Math.min(current.students + increment.students, targets.students),
                graduates: Math.min(current.graduates + increment.graduates, targets.graduates),
              };
              setCounts({ ...current });
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const values = [
    {
      icon: BookOpen,
      title: 'Rigorous Study',
      description: 'Comprehensive biblical education grounded in scholarly research and spiritual insight.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Learn alongside fellow seekers in a supportive, inclusive community of faith.'
    },
    {
      icon: Award,
      title: 'Expert Instruction',
      description: 'Learn from experienced educators passionate about biblical knowledge and spiritual growth.'
    }
  ];

  const departments = [
    {
      title: 'Department of Theology',
      description: 'Deep dive into the systematic study of Christian doctrines, church history, and theological foundations.',
      icon: BookMarked,
      color: 'from-accent to-blue-800'
    },
    {
      title: 'Department of Biblical Studies',
      description: 'Comprehensive examination of the biblical canon with focus on exegesis, hermeneutics, and historical context.',
      icon: BookOpen,
      color: 'from-secondary to-red-900'
    },
    {
      title: 'Apostolic Ministry',
      description: 'Training for modern apostolic leadership, church planting, and effective ministry governance.',
      icon: GraduationCap,
      color: 'from-accent to-indigo-800'
    },
    {
      title: 'Prophetic College',
      description: 'Unlocking the gift of prophecy and developing spiritual discernment for kingdom advancement.',
      icon: Star,
      color: 'from-secondary to-red-800'
    },
    {
      title: 'Counseling & Music',
      description: 'Professional training in Christian counseling and sacred music for holistic ministry.',
      icon: Heart,
      color: 'from-accent to-blue-900'
    }
  ];

  const testimonials = [
    {
      text: 'STSC transformed my understanding of Scripture. The courses are well-structured and the instructors are deeply knowledgeable. I recommend this institution to anyone serious about theological education.',
      author: 'Rev. Sarah Johnson',
      role: 'Alumni, Class of 2023'
    },
    {
      text: 'I came seeking knowledge and found a community. The spiritual growth I\'ve experienced here is immeasurable. The mentorship and guidance have shaped my ministry profoundly.',
      author: 'Michael Chen',
      role: 'Current Student, Theology'
    },
    {
      text: 'The hermeneutics course equipped me with tools I use in ministry every day. The practical approach to learning made all the difference in my spiritual journey.',
      author: 'Rev. Patricia Williams',
      role: 'Alumni, Class of 2021'
    },
    {
      text: 'STSC offers a unique blend of academic rigor and spiritual formation. The faculty genuinely care about your growth both intellectually and spiritually.',
      author: 'Dr. James Mensah',
      role: 'Alumni, Class of 2020'
    }
  ];

  const news = [
    {
      title: '2025/2026 Academic Year Admissions Now Open',
      date: 'March 15, 2026',
      category: 'Admissions',
      description: 'Applications are now being accepted for the upcoming academic year across all departments.'
    },
    {
      title: 'Annual Graduation Ceremony - Save the Date',
      date: 'February 28, 2026',
      category: 'Events',
      description: 'Join us in celebrating our graduating class of 2026 on July 15th at our main campus.'
    },
    {
      title: 'New Counseling Program Accreditation',
      date: 'January 10, 2026',
      category: 'Academic',
      description: 'Our Christian Counseling program receives full accreditation from the relevant theological board.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section relative" style={{ minHeight: '85vh' }}>
        {/* Background Images */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url("${img}")`,
              opacity: i === currentImageIndex ? 1 : 0
            }}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-accent/70 to-secondary/60"></div>

        <div className="relative z-10 container text-center px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-ring/20 backdrop-blur-sm text-ring px-4 py-2 rounded-full text-sm font-medium mb-6 fade-in">
              <GraduationCap size={16} />
              Welcome to STSC
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight fade-in" style={{ animationDelay: '0.1s' }}>
              Raising{' '}
              <span className="text-ring">Spotless Leaders</span>
              {' '}for Global Impact
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed fade-in" style={{ animationDelay: '0.2s' }}>
              Born out of passion to raise unquestionable leaders that can move beyond their jurisdiction
              to impact their generation for God and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.3s' }}>
              <Link href="/courses" className="btn-gold text-base px-8 py-4 inline-flex items-center justify-center gap-2">
                Explore Courses <ArrowRight size={20} />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 text-base">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-accent text-accent-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: Math.round(counts.years), label: 'Years of Excellence', suffix: '+' },
              { value: Math.round(counts.programs), label: 'Programs Offered', suffix: '+' },
              { value: Math.round(counts.students / 100) * 100, label: 'Students Enrolled', suffix: '+' },
              { value: Math.round(counts.graduates / 100) * 100, label: 'Graduates', suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-ring mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/Apostle Dr Asravor Dzigbordi Aku Selasi Success.jpeg"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-ring/20 rounded-2xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10"></div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
                <span className="w-8 h-0.5 bg-accent"></span>
                Welcome to STSC
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Shaping Lives for{' '}
                <span className="text-accent">Spiritual Leadership</span>
              </h2>
              <div className="w-16 h-1 bg-ring mb-6"></div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Success Theological Seminary and College was founded with a divine mandate to raise
                unquestionable leaders who will impact their generation for God and community.
                We are committed to providing comprehensive theological education that combines
                academic excellence with spiritual formation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our programs are designed to equip students with the knowledge, skills, and spiritual
                depth needed to serve effectively in various ministry contexts. With campuses across
                Ghana, we bring quality theological education within reach of every called servant of God.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium">5 Campuses Nationwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Calendar size={18} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium">Est. 2005</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock size={18} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium">Flexible Learning</span>
                </div>
              </div>
              <Link href="/about" className="btn-primary inline-flex items-center gap-2">
                Read More About Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Departments / Schools Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Our Schools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Academic Departments</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully designed departments that guide you through biblical knowledge and spiritual development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <Link key={index} href="/courses" className="group block">
                  <Card className="card-spiritual p-8 card-hover h-full relative overflow-hidden">
                    {/* Top gradient bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${dept.color}`}></div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{dept.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{dept.description}</p>
                    <div className="mt-5 flex items-center text-accent text-sm font-semibold group-hover:gap-3 transition-all gap-2">
                      View Programs <ArrowRight size={16} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
              View All Programs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Why STSC
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes Success Theological Seminary and College the preferred choice for theological education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card-spiritual text-center p-10 card-hover relative">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our students and alumni about their experience at STSC.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <Card className="card-spiritual p-10 md:p-14 text-center relative">
              <Quote className="w-12 h-12 text-accent/20 absolute top-6 left-6" />
              <div className="mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="inline-block text-ring fill-ring" />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 font-serif italic">
                "{testimonials[testimonialIndex].text}"
              </blockquote>
              <div className="w-12 h-0.5 bg-ring mx-auto mb-4"></div>
              <p className="font-bold text-lg">{testimonials[testimonialIndex].author}</p>
              <p className="text-sm text-muted-foreground">{testimonials[testimonialIndex].role}</p>
            </Card>

            {/* Navigation Arrows */}
            <button
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 p-2 bg-card border border-border rounded-full shadow-md hover:bg-muted transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 p-2 bg-card border border-border rounded-full shadow-md hover:bg-muted transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === testimonialIndex ? 'bg-accent w-6' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              News & Updates
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from STSC</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest news, events, and announcements from our institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Card key={index} className="card-spiritual card-hover overflow-hidden p-0">
                <div className="h-2 bg-gradient-to-r from-accent to-secondary"></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 leading-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
                  <a href="#" className="text-accent font-semibold text-sm hover:text-accent/80 transition-colors inline-flex items-center gap-1 group">
                    Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 border-2 border-white rounded-full"></div>
        </div>
        <div className="container text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <div className="w-16 h-1 bg-ring mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join our community of learners and deepen your understanding of Scripture and faith.
            Take the first step towards your calling today.
          </p>
          <Link href="/apply" className="btn-gold text-lg px-10 py-5 inline-flex items-center gap-2">
            Apply Now <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
