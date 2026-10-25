import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does the AI Readiness Score work?',
    a: 'Instead of just counting how many problems you solved, AlgoOrbit looks at problem difficulty (Easy/Medium/Hard), contest ratings, active coding days, and core subject scores. It compares these directly with hiring standards to give you an easy-to-understand score from 0 to 100.',
  },
  {
    q: 'Do I need to share my passwords or credentials?',
    a: 'Never. You only enter your public usernames (like your LeetCode or GitHub username). We only read publicly available profile data — no passwords are ever needed.',
  },
  {
    q: 'How often does my coding activity update?',
    a: 'Your profiles update automatically or whenever you tap "Sync Profiles" on your dashboard. Solved counts, ratings, and recent activity refresh in seconds.',
  },
  {
    q: 'What is the difference between Tier-1, Tier-2, and Tier-3 companies?',
    a: 'Tier-1 represents top tech companies (like Google, Microsoft, Amazon) with high problem-solving bars. Tier-2 includes large tech firms requiring solid DSA and core CS knowledge. Tier-3 covers mass campus recruiters and IT service companies.',
  },
  {
    q: 'Can I practice Operating Systems, DBMS, and Aptitude?',
    a: 'Yes! AlgoOrbit includes dedicated practice quizzes and smart revision flashcards for OS, DBMS, Computer Networks, and Aptitude so you can quickly refresh important concepts.',
  },
  {
    q: 'Is AlgoOrbit free for college students?',
    a: 'Yes, AlgoOrbit is 100% free for students preparing for campus placements. Connect your profiles, get AI insights, and track daily revisions at zero cost.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative z-10 px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32 border-t border-border bg-card/60 dark:bg-card/40">
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Got Questions?
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Everything you need to know about connecting profiles, readiness scores, and company targets.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {FAQS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={q}
                className="rounded-xl sm:rounded-2xl border border-border bg-card/95 dark:bg-card/85 overflow-hidden transition-all duration-200 hover:border-primary/50 shadow-xs backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full min-h-[52px] flex items-center justify-between p-4 sm:p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base md:text-lg text-foreground pr-3">{q}</span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-primary/10 border-primary/30 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/60">
                        <p className="pt-3 sm:pt-4">{a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
