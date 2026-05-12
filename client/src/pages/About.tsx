import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSEO, SEO } from '@/hooks/useSEO';

/**
 * About Page
 * 
 * Design Philosophy: Modern Spiritual Minimalism
 * - Mission and vision statements
 * - Staff bios with photos
 * - History timeline
 * - Institutional values
 */
export default function About() {
  useSEO(SEO.about);

  const staff = [
    {
      name: 'Dr. James Mitchell',
      role: 'Founder & Director',
      bio: 'With over 25 years of biblical scholarship and ministry experience, Dr. Mitchell founded SUCCESS THEOLOGICAL SEMINARY AND COLLEGE to make rigorous biblical education accessible to all seekers.'
    },
    {
      name: 'Dr. Sarah Chen',
      role: 'Academic Director',
      bio: 'Dr. Chen holds a Ph.D. in Biblical Studies and specializes in Old Testament literature and theology. She brings scholarly rigor and pastoral sensitivity to curriculum design.'
    },
    {
      name: 'Rev. Michael Torres',
      role: 'Spiritual Formation Director',
      bio: 'Rev. Torres integrates spiritual practices with academic learning, ensuring students develop both intellectual understanding and spiritual depth.'
    },
    {
      name: 'Dr. Elizabeth Warren',
      role: 'Advanced Studies Coordinator',
      bio: 'Dr. Warren leads our advanced hermeneutics and theology programs, mentoring students pursuing deeper biblical scholarship and ministry leadership.'
    }
  ];

  const timeline = [
    {
      year: '2013',
      title: 'Humble Beginnings',
      description: 'SUCCESS THEOLOGICAL SEMINARY AND COLLEGE commenced with 14 students on 23rd August 2013, born out of a passion to raise unquestionable leaders.'
    },
    {
      year: '2016',
      title: 'Regional Expansion',
      description: 'Expanded beyond our initial jurisdiction, establishing our first regional campuses to reach more students for God and community.'
    },
    {
      year: '2020',
      title: 'Institutional Growth',
      description: 'Developed advanced degree programs across multiple departments, including Theology, Biblical Studies, and Apostolic Ministry.'
    },
    {
      year: 'Today',
      title: 'Seven Campuses',
      description: 'Currently privileged to impact lives through seven campuses: Kasoa-Nyanyano, Teshie, Kumasi, Ho, Hohoe, Techiman, and Bolgatanga.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-muted border-b">
        <div className="container text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">About SUCCESS THEOLOGICAL SEMINARY AND COLLEGE</h1>
          <div className="section-divider mb-8"></div>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            This prestige college was born out of passion to raise unquestionable leaders that can move beyond their jurisdiction to impact their generation for God and community.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-secondary">Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To raise leaders of integrity and influence for global transformation.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-secondary">Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To equip and empower students with biblical knowledge, spiritual maturity, and practical skills for effective ministry and service.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-muted p-10 rounded-xl border border-border shadow-sm">
            <h3 className="text-2xl font-bold mb-8 text-center">Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Integrity', desc: 'Upholding moral and spiritual principles in all aspects of life and leadership.' },
                { title: 'Excellence', desc: 'Pursuing academic and spiritual excellence to the highest standards.' },
                { title: 'Service', desc: 'Serving God and humanity with humility, compassion, and dedication.' },
                { title: 'Community', desc: 'Fostering a supportive, inclusive, and Christ-centered environment for growth.' }
              ].map((value, index) => (
                <div key={index} className="bg-background p-6 rounded-lg border-l-4 border-secondary shadow-sm">
                  <h4 className="font-bold mb-2 text-primary">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-muted">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold mb-16 text-center">Our Journey</h2>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                    {item.year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-1 h-16 bg-accent/30 mt-2"></div>
                  )}
                </div>
                <div className="pb-8 pt-2">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold mb-16 text-center">Our Faculty</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {staff.map((member, index) => (
              <Card key={index} className="card-spiritual p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-accent font-semibold mb-4">{member.role}</p>
                <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '7', label: 'Campuses Nationwide' },
              { number: '42', label: 'Degree Programs' },
              { number: '10+', label: 'Years of Excellence' },
              { number: '14', label: 'Founding Students' }
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold mb-2 text-white">{stat.number}</p>
                <p className="text-lg opacity-90 text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
