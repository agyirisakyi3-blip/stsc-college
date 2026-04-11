import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSEO, SEO } from '@/hooks/useSEO';

/**
 * Home Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - Hero section with inspiring background image
 * - Value propositions with icons
 * - Testimonials section
 * - Call-to-action buttons
 */
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
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

  const testimonials = [
    {
      text: 'SUCCESS THEOLOGICAL SEMINARY AND COLLEGE transformed my understanding of Scripture. The courses are well-structured and the instructors are deeply knowledgeable.',
      author: 'Sarah Johnson',
      role: 'Student'
    },
    {
      text: 'I came seeking knowledge and found a community. The spiritual growth I\'ve experienced here is immeasurable.',
      author: 'Michael Chen',
      role: 'Student'
    },
    {
      text: 'The hermeneutics course equipped me with tools I use in ministry every day. Highly recommended.',
      author: 'Rev. Patricia Williams',
      role: 'Alumni'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url("${heroImages[currentImageIndex]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 container text-center max-w-3xl mx-auto px-4 py-20">

          <p className="text-xl md:text-2xl text-white/90 mb-8 fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Born out of passion to raise unquestionable leaders that can move beyond their jurisdiction to impact their generation for God and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/courses" className="btn-primary text-lg px-8 py-6 inline-flex items-center justify-center rounded-md font-medium transition-colors">
              Explore Courses <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/about" className="btn-outline text-lg px-8 py-6 inline-flex items-center justify-center rounded-md font-medium transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SUCCESS THEOLOGICAL SEMINARY AND COLLEGE?</h2>
            <div className="section-divider"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="card-spiritual text-center p-8 hover:scale-105 transition-transform duration-300"
                >
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <div className="section-divider"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully designed courses that guide you through biblical knowledge and spiritual development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: 'Advanced Systematic Theology',
                level: 'Department of theology',
                description: 'Deep dive into the systematic study of Christian doctrines and their historical development.'
              },
              {
                title: 'Old & New Testament Mastery',
                level: 'Department of biblical studies',
                description: 'Comprehensive examination of the biblical canon, focusing on exegesis and historical context.'
              },
              {
                title: 'Apostolic Leadership & Governance',
                level: 'Department of apostles',
                description: 'Training for modern apostolic ministry and effective church administration.'
              },
              {
                title: 'Prophetic Ministry & Discernment',
                level: 'Department of Prophetic college',
                description: 'Unlocking the gift of prophecy and developing spiritual discernment for the church.'
              }
            ].map((course, index) => (
              <Card key={index} className="card-spiritual p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    {course.level}
                  </span>
                </div>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                <Link href="/courses" className="text-accent font-semibold hover:text-accent/80 transition-colors inline-flex items-center gap-2">
                  View Details <ArrowRight size={16} />
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/courses" className="btn-primary text-lg px-8 py-6 inline-flex items-center justify-center rounded-md font-medium transition-colors">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <div className="section-divider"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-spiritual p-8">
                <blockquote className="mb-6 text-lg">
                  "{testimonial.text}"
                </blockquote>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of learners and deepen your understanding of Scripture and faith.
          </p>
          <Link href="/apply" className="bg-accent-foreground text-accent hover:bg-white text-lg px-8 py-6 inline-flex items-center justify-center rounded-md font-medium transition-colors">
            Apply Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
