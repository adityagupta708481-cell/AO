import React from 'react';
import { Award, Star, Quote } from 'lucide-react';

const METRICS = [
  { value: '450K+', label: 'Problems Solved', sub: 'Across LeetCode & Codeforces' },
  { value: '89.4%', label: 'Offer Rate', sub: 'For interview-ready students' },
  { value: '3.4x', label: 'Faster Preparation', sub: 'Compared to random practice' },
  { value: '15+', label: 'Company Profiles', sub: 'Updated for campus hiring' },
];

const TESTIMONIALS = [
  {
    name: 'Aditya Kashyap',
    role: 'SDE 1 Offer',
    company: 'Amazon',
    score: '91% Ready',
    quote:
      'AlgoOrbit flagged that while my overall solved count was high (450+), I was weak in Graph BFS/DFS and OS Semaphores. I spent 2 weeks fixing only those weak spots and cleared Amazon’s round 2 seamlessly.',
    avatar: 'AK',
    college: 'IIT Roorkee',
  },
  {
    name: 'Sneha Roy',
    role: 'Software Engineer Offer',
    company: 'Microsoft',
    score: '88% Ready',
    quote:
      'The daily revision calendar for DBMS and OS was a lifesaver. In the managerial and tech rounds, they grilled me on transaction isolation and virtual memory — things I usually blanked on, but had revised that morning.',
    avatar: 'SR',
    college: 'NIT Trichy',
  },
  {
    name: 'Kunal Mathur',
    role: 'Quantitative Tech Offer',
    company: 'Goldman Sachs',
    score: '94% Ready',
    quote:
      'Connecting both Codeforces and LeetCode gave me a single clear picture. Seeing my top company match hit 94% gave me the confidence to negotiate a top bracket offer during on-campus recruitment.',
    avatar: 'KM',
    college: 'BITS Pilani',
  },
];

export default function StudentProofSection() {
  return (
    <section className="relative z-10 px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl">
        {/* Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
          {METRICS.map(({ value, label, sub }) => (
            <div
              key={label}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card/90 border border-border text-center shadow-lg backdrop-blur-xl hover:border-primary/40 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-primary mb-1 tracking-tight">
                {value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-foreground mb-0.5">{label}</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">{sub}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Real Student Outcomes
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent leading-tight">
            Placed candidates share their experience.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            See how students turned scattered preparation into offer letters from dream companies.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, company, score, quote, avatar, college }) => (
            <div
              key={name}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card/90 p-5 sm:p-6 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between hover:border-primary/50 hover:shadow-2xl transition-all"
            >
              <div>
                {/* Header with Company badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {score}
                  </span>
                </div>

                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/20 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed mb-5 sm:mb-6 italic">"{quote}"</p>
              </div>

              <div className="pt-3.5 sm:pt-4 border-t border-border/60 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                  {avatar}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-foreground truncate">{name}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {role} · <span className="text-primary font-semibold">{company}</span> ({college})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
