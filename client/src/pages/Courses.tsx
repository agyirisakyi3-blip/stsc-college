import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Users, BookOpen, ArrowRight, X } from 'lucide-react';
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

/**
 * Courses Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - Course grid with cards
 * - Course detail modal
 * - Filter by level
 * - Responsive design
 */
export default function Courses() {
  useSEO(SEO.courses);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  useEffect(() => {
    setCourses(coursesData as Course[]);
  }, []);

  const levels = [
    'All',
    'Department of theology',
    'Department of biblical studies',
    'Department of apostles',
    'Department of prophetic college',
    'Department of counseling',
    'Department of music (DAVIDIC COLLEGE OF MUSIC)',
    'Department of Mission'
  ];

  const filteredCourses = selectedLevel === 'All'
    ? courses
    : courses.filter(course => course.level === selectedLevel);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative min-h-[400px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/Campus.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container text-center max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-white mb-4">Our Courses</h1>
          <p className="text-xl text-white/90">
            Explore our carefully designed courses that guide you through biblical knowledge and spiritual development.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-muted">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedLevel === level
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-background text-foreground border-2 border-border hover:border-accent'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredCourses.map(course => (
              <Card
                key={course.id}
                className="card-spiritual overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Course Image */}
                <div className="h-48 bg-muted overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Course Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold flex-1">{course.title}</h3>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full whitespace-nowrap ml-2">
                      {course.level}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-6 flex-1">{course.summary}</p>

                  {/* Course Meta */}
                  <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-accent" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-accent" />
                      <span>{course.capacity} students max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-accent" />
                      <span>Starts: {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 text-accent font-semibold hover:text-accent/80 transition-colors py-2 border border-accent rounded-lg hover:bg-accent/5"
                    >
                      View Details
                    </button>
                    <Link href="/apply" className="btn-primary inline-flex items-center justify-center rounded-md font-medium transition-colors px-4 py-2">
                      Apply <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No courses found for the selected level.</p>
            </div>
          )}
        </div>
      </section>

      {/* Course Detail Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Course Image */}
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Course Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Level</p>
                    <p className="font-semibold">{selectedCourse.level}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold">{selectedCourse.duration}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                    <p className="font-semibold">{selectedCourse.instructor}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                    <p className="font-semibold">{selectedCourse.capacity} students</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold mb-2">Course Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedCourse.fullDescription}</p>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="font-bold mb-2">Schedule</h3>
                  <p className="text-muted-foreground">{selectedCourse.schedule}</p>
                  <p className="text-muted-foreground">Starts: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                </div>

                {/* Prerequisites */}
                <div>
                  <h3 className="font-bold mb-2">Prerequisites</h3>
                  <p className="text-muted-foreground">{selectedCourse.prerequisites || 'None'}</p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="font-bold mb-3">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    {selectedCourse.outcomes.map((outcome, index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="text-accent font-bold">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex gap-3 pt-4 border-t">
                  <Link href="/apply" className="btn-primary flex-1 inline-flex items-center justify-center rounded-md font-medium transition-colors px-4 py-2">
                    Apply for This Course
                  </Link>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn-outline flex-1"
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
