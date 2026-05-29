import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, Heart, Shield, Users, MapPin, Phone, Mail, Clock, Award, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSEO, SEO } from '@/hooks/useSEO';
import { Link } from 'wouter';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function About() {
  useSEO(SEO.about);

  const milestones = [
    {
      year: '2013',
      title: 'Humble Beginnings',
      description: 'SUCCESS THEOLOGICAL SEMINARY AND COLLEGE commenced with 14 students on 23rd August 2013, born out of a passion to raise unquestionable leaders.',
    },
    {
      year: '2016',
      title: 'Regional Expansion',
      description: 'Expanded beyond our initial jurisdiction, establishing first regional campuses to reach more students for God and community.',
    },
    {
      year: '2020',
      title: 'Institutional Growth',
      description: 'Developed advanced degree programs across multiple departments including Theology, Biblical Studies, and Apostolic Ministry.',
    },
    {
      year: 'Today',
      title: 'Seven Campuses',
      description: 'Privileged to impact lives through seven campuses: Kasoa-Nyanyano, Teshie, Kumasi, Ho, Hohoe, Techiman, and Bolgatanga.',
    },
  ];

  const values = [
    { icon: Shield, title: 'Integrity', desc: 'Upholding moral and spiritual principles in all aspects of life and leadership.' },
    { icon: Award, title: 'Excellence', desc: 'Pursuing academic and spiritual excellence to the highest standards.' },
    { icon: Heart, title: 'Service', desc: 'Serving God and humanity with humility, compassion, and dedication.' },
    { icon: Users, title: 'Community', desc: 'Fostering a supportive, inclusive, and Christ-centered environment for growth.' },
  ];

  const leadership = [
    {
      name: 'Apostle Dr. Asravor Dzigbordi Aku Selasi Success',
      role: 'Founder & General Overseer',
      initials: 'AS',
      bio: 'Visionary founder whose divine mandate birthed Success Theological Seminary and College to raise unquestionable leaders for global impact.',
    },
    {
      name: 'Apostle Dr. Joseph Mensah',
      role: 'Academic Director',
      initials: 'JM',
      bio: 'Provides strategic academic leadership, ensuring curriculum excellence and institutional accreditation across all programs.',
    },
    {
      name: 'Rev. Dr. Elizabeth Annan',
      role: 'Dean of Students',
      initials: 'EA',
      bio: 'Oversees student welfare, spiritual formation, and campus life across all seven STSC campuses nationwide.',
    },
    {
      name: 'Dr. Samuel K. Asare',
      role: 'Director of Research',
      initials: 'SA',
      bio: 'Leads theological research initiatives and advanced studies, bridging academic scholarship with practical ministry.',
    },
  ];

  const policies = [
    {
      title: 'Admission Requirements',
      icon: GraduationCap,
      content: [
        'Completed application form with two passport-size photographs',
        'Certified copies of WASSCE/SSSCE results or equivalent',
        'Transcripts from previous institutions (for transfer applicants)',
        'Two academic reference letters',
        'Passport-size photographs (2)',
        'Application fee payment receipt',
      ],
    },
    {
      title: 'Academic Standards',
      icon: BookOpen,
      content: [
        'Minimum CGPA of 1.00 required for good academic standing',
        'Students below 1.00 CGPA placed on probation for two semesters',
        'Continuous assessment accounts for 30% of final grade',
        'End-of-semester examinations account for 70% of final grade',
        'Attendance of at least 80% required per course',
      ],
    },
    {
      title: 'Code of Conduct',
      icon: Shield,
      content: [
        'Students shall maintain high moral and ethical standards',
        'Regular chapel attendance is mandatory for all students',
        'Respect for faculty, staff, and fellow students is expected',
        'Academic dishonesty and plagiarism are strictly prohibited',
        'Dress code must reflect Christian values and professionalism',
      ],
    },
  ];

  const campuses = [
    { location: 'Kasoa-Nyanyano', region: 'Central Region' },
    { location: 'Teshie', region: 'Greater Accra' },
    { location: 'Kumasi', region: 'Ashanti Region' },
    { location: 'Ho', region: 'Volta Region' },
    { location: 'Hohoe', region: 'Volta Region' },
    { location: 'Techiman', region: 'Bono East Region' },
    { location: 'Bolgatanga', region: 'Upper East Region' },
  ];

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-ring/20 backdrop-blur-sm text-ring px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <GraduationCap size={16} />
            About Us
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >About STSC</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Success Theological Seminary and College — raising spotless leaders for global impact since 2013.
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-background"
      >
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Our Identity
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              This prestige college was born out of passion to raise unquestionable leaders that can move beyond their jurisdiction to impact their generation for God and community. At STSC, we maintain the highest standards of academic integrity and spiritual formation, ensuring a disciplined and conducive environment for learning and research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-muted p-10 rounded-xl border border-border">
              <h2 className="text-3xl font-bold mb-4 text-accent">Our Vision</h2>
              <div className="w-12 h-1 bg-ring mb-6"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To raise leaders of integrity and influence for global transformation.
              </p>
            </div>
            <div className="bg-muted p-10 rounded-xl border border-border">
              <h2 className="text-3xl font-bold mb-4 text-accent">Our Mission</h2>
              <div className="w-12 h-1 bg-ring mb-6"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To equip and empower students with biblical knowledge, spiritual maturity, and practical skills for effective ministry and service.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-gradient-to-br from-accent/5 to-secondary/5 p-10 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-10 text-center">Our Core Values</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div key={i} variants={cardItem} className="bg-background p-6 rounded-lg border-l-4 border-secondary shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={20} className="text-accent" />
                      <h4 className="font-bold text-lg">{v.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* History Timeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-muted"
      >
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Our Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Institutional Timeline</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-lg">
                    {item.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-accent/30"></div>
                  )}
                </div>
                <div className="pb-8 pt-3">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Leadership */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-background"
      >
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated servants leading with vision, integrity, and a commitment to theological excellence.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {leadership.map((member, i) => (
              <motion.div key={i} variants={cardItem}>
                <Card className="card-spiritual p-8 card-hover">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-accent">{member.initials}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent font-semibold text-sm mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics */}
      <section className="py-16 bg-accent text-accent-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-ring rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-ring rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '7', label: 'Campuses Nationwide' },
              { number: '51', label: 'Programs Offered' },
              { number: '13', label: 'Years of Excellence' },
              { number: '14', label: 'Founding Students' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-ring mb-2">{stat.number}</p>
                <p className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies & Regulations */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-muted"
      >
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Our Standards
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rules & Regulations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At STSC, we maintain high standards of academic integrity, spiritual discipline, and moral conduct. Our policies are designed to ensure a fair, disciplined, and conducive environment for learning and spiritual formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {policies.map((policy, i) => {
              const Icon = policy.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <Card className="card-spiritual p-8 h-full">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                      <Icon size={28} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-5">{policy.title}</h3>
                    <ul className="space-y-3">
                      {policy.content.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <ChevronRight size={14} className="text-ring mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Campuses */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-background"
      >
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-accent"></span>
              Locations
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Campuses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven campuses across Ghana, bringing quality theological education within reach.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {campuses.map((campus, i) => (
              <motion.div key={i} variants={cardItem} className="flex items-center gap-3 bg-muted p-5 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{campus.location}</p>
                  <p className="text-xs text-muted-foreground">{campus.region}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 bg-gradient-to-r from-accent to-secondary relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 border-2 border-white rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>
        <div className="container text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >Begin Your Journey at STSC</motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-16 h-1 bg-ring mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-white/80 mb-10 max-w-xl mx-auto"
          >
            Join a community committed to raising spotless leaders for global impact. Apply today and begin your transformation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/apply" className="btn-gold text-lg px-10 py-5 inline-flex items-center gap-2">
              Apply Now <ArrowRight size={22} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
