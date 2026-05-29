import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Users, BookOpen, ArrowRight, GraduationCap, BookMarked, Star, Heart, Globe, MapPin, Monitor, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import coursesData from '@/data/courses.json';
import { useSEO, SEO } from '@/hooks/useSEO';
import { Link } from 'wouter';

interface Course {
  id: string;
  title: string;
  summary: string;
  fullDescription: string;
  level: string;
  duration: string;
  prerequisites: string;
  thumbnail: string;
  instructor: string;
  capacity: number;
  startDate: string;
  schedule: string;
  outcomes: string[];
}

const departments = [
  {
    id: 'theology',
    label: 'Department of theology',
    icon: BookMarked,
    description: 'Comprehensive theological education grounded in scholarly research, spiritual formation, and ministerial practice.',
    color: 'from-accent to-blue-800',
    summary: '6 Programs',
    image: '/images/Theologgy.jpeg',
  },
  {
    id: 'biblical-studies',
    label: 'Department of biblical studies',
    icon: BookOpen,
    description: 'In-depth study of the biblical canon with focus on exegesis, hermeneutics, and original languages.',
    color: 'from-secondary to-red-900',
    summary: '6 Programs',
    image: '/images/Biblical Studies.jpeg',
  },
  {
    id: 'apostles',
    label: 'Department of apostles',
    icon: GraduationCap,
    description: 'Training for apostolic leadership, church governance, and pioneering ministry in modern contexts.',
    color: 'from-accent to-indigo-800',
    summary: '6 Programs',
    image: '/images/leadership.jpeg',
  },
  {
    id: 'prophetic',
    label: 'Department of prophetic college',
    icon: Star,
    description: 'Unlocking prophetic gifts and developing spiritual discernment for effective kingdom ministry.',
    color: 'from-secondary to-red-800',
    summary: '6 Programs',
    image: '/images/Prophetic.jpeg',
  },
  {
    id: 'counseling',
    label: 'Department of counseling',
    icon: Heart,
    description: 'Professional Christian counseling training combining biblical wisdom with therapeutic practice.',
    color: 'from-accent to-blue-900',
    summary: '6 Programs',
    image: '/images/Counseling.jpeg',
  },
  {
    id: 'music',
    label: 'Department of music (DAVIDIC COLLEGE OF MUSIC)',
    icon: Globe,
    description: 'Sacred music excellence, worship leadership, and musical artistry for ministry and beyond.',
    color: 'from-secondary to-red-900',
    summary: '6 Programs',
    image: '/images/Music .jpeg',
  },
  {
    id: 'mission',
    label: 'Department of Mission',
    icon: Globe,
    description: 'Cross-cultural ministry training, evangelism strategies, and global mission leadership.',
    color: 'from-accent to-indigo-800',
    summary: '6 Programs',
    image: '/images/Mission.jpeg',
  },
];

export default function Courses() {
  useSEO(SEO.courses);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);

  useEffect(() => {
    setCourses(coursesData as Course[]);
  }, []);

  const getCoursesForDept = (level: string) =>
    courses.filter(c => c.level === level);

  const scrollToDept = (level: string) => {
    setActiveDepartment(level);
    const el = document.getElementById(`dept-${level.replace(/\s+/g, '-').toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/Campus.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-accent/70 to-secondary/60"></div>
        <div className="relative z-10 container text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-ring/20 backdrop-blur-sm text-ring px-4 py-2 rounded-full text-sm font-medium mb-6 fade-in">
            <GraduationCap size={16} />
            Academic Programs
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 fade-in">Our Schools & Programs</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.1s' }}>
            Explore our carefully designed departments offering comprehensive theological education for spiritual leaders.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 bg-accent text-accent-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '7', label: 'Academic Departments', icon: BookMarked },
              { value: '42', label: 'Programs Offered', icon: BookOpen },
              { value: '6', label: 'Study Levels', icon: GraduationCap },
              { value: '3', label: 'Learning Formats', icon: Monitor },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center flex flex-col items-center gap-2">
                  <Icon size={24} className="text-ring" />
                  <div className="text-3xl font-bold text-ring">{stat.value}</div>
                  <p className="text-xs text-white/70 uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Department Navigation */}
      <section className="py-6 bg-muted sticky top-20 z-40 border-b border-border">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => scrollToDept(dept.label)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeDepartment === dept.label
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-background text-foreground border border-border hover:border-accent'
                }`}
              >
                {dept.label === 'Department of music (DAVIDIC COLLEGE OF MUSIC)' ? 'Music' : dept.label.replace('Department of ', '')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Department Sections */}
      {departments.map((dept, deptIdx) => {
        const Icon = dept.icon;
        const deptCourses = getCoursesForDept(dept.label);
        if (deptCourses.length === 0) return null;

        return (
          <section
            key={dept.id}
            id={`dept-${dept.label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-16 ${deptIdx % 2 === 0 ? 'bg-background' : 'bg-muted'}`}
          >
            <div className="container">
              {/* Department Header */}
              <div className="flex flex-col lg:flex-row gap-8 mb-12">
                <div className="lg:w-1/3">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">{dept.label.replace('Department of ', '')}</h2>
                  <div className="w-12 h-1 bg-ring mb-4"></div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{dept.description}</p>
                  <div className="flex items-center gap-2 text-sm text-accent font-medium">
                    <GraduationCap size={16} />
                    {deptCourses.length} Programs Available
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deptCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="card-spiritual p-5 card-hover cursor-pointer"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm leading-tight flex-1">{course.title}</h3>
                          <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold rounded-full whitespace-nowrap ml-2">
                            {course.duration}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.summary}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={12} />{course.schedule}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Study Options Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-ring text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-ring"></span>
              Learning Formats
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Flexible Learning Options</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Choose the study format that works best for your schedule and ministry commitments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Full-Time Regular',
                icon: Calendar,
                desc: 'Attend full-time daytime classes on campus, engaging in face-to-face instruction and campus activities.',
                features: ['Monday - Friday schedule', 'Campus community access', 'Library & research facilities'],
              },
              {
                title: 'Evening & Weekend',
                icon: Clock,
                desc: 'Classes scheduled during evenings and weekends, ideal for working ministers and professionals.',
                features: ['Flexible scheduling', 'Work-study balance', 'Same curriculum & certification'],
              },
              {
                title: 'Distance / Online',
                icon: Monitor,
                desc: 'Complete coursework remotely through online platforms with instructor support and peer interaction.',
                features: ['Study from anywhere', 'Self-paced learning', 'Digital resources & support'],
              },
            ].map((option, i) => {
              const OptionIcon = option.icon;
              return (
                <Card key={i} className="bg-white/10 border-white/10 backdrop-blur-sm p-8 card-hover">
                  <div className="w-14 h-14 rounded-xl bg-ring/20 flex items-center justify-center mb-5">
                    <OptionIcon className="w-7 h-7 text-ring" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">{option.desc}</p>
                  <ul className="space-y-2">
                    {option.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="w-1.5 h-1.5 bg-ring rounded-full"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Choose Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
                <span className="w-8 h-0.5 bg-accent"></span>
                Guidance
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Choose Your Program</h2>
              <p className="text-lg text-muted-foreground">
                Follow these steps to select the program that aligns with your calling and goals.
              </p>
            </div>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Assess Your Interests & Calling',
                  desc: 'Reflect on your spiritual gifts, ministry interests, and the areas where you feel called to serve.',
                },
                {
                  step: '02',
                  title: 'Identify Your Goals',
                  desc: 'Consider your career or ministry aspirations. Do you want to pastor, teach, counsel, or lead worship?',
                },
                {
                  step: '03',
                  title: 'Review Program Details',
                  desc: 'Look at the curriculum, duration, and outcomes of each program to find the best fit.',
                },
                {
                  step: '04',
                  title: 'Consider Your Schedule',
                  desc: 'Choose from full-time, evening/weekend, or distance learning to suit your commitments.',
                },
                {
                  step: '05',
                  title: 'Apply & Begin Your Journey',
                  desc: 'Submit your application and take the first step toward transforming your ministry.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="text-3xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors min-w-[48px]">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 border-2 border-white rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>
        <div className="container text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Enroll?</h2>
          <div className="w-16 h-1 bg-ring mx-auto mb-6"></div>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Take the next step in your spiritual journey. Apply now and begin your transformative education.
          </p>
          <Link href="/apply" className="btn-gold text-lg px-10 py-5 inline-flex items-center gap-2">
            Apply Now <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Course Detail Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    {selectedCourse.level}
                  </span>
                  <span className="px-3 py-1 bg-ring/10 text-ring text-xs font-semibold rounded-full">
                    {selectedCourse.duration}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-full h-56 object-cover rounded-xl"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Department', value: selectedCourse.level.replace('Department of ', '') },
                    { label: 'Duration', value: selectedCourse.duration },
                    { label: 'Schedule', value: selectedCourse.schedule },
                    { label: 'Capacity', value: `${selectedCourse.capacity} students` },
                  ].map((info, i) => (
                    <div key={i} className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-0.5">{info.label}</p>
                      <p className="font-semibold text-sm">{info.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-lg">About This Program</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedCourse.fullDescription}</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Prerequisites</h3>
                  <p className="text-muted-foreground">{selectedCourse.prerequisites || 'None'}</p>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    {selectedCourse.outcomes.map((outcome, index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="text-accent font-bold mt-0.5">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Link href="/apply" className="btn-primary flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3">
                    Apply for This Course <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn-outline px-6 py-3"
                  >
                    Close
                  </button>
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
