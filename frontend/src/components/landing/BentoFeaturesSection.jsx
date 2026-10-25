import React from 'react';
import {
  BrainCircuit,
  Radar,
  CalendarCheck,
  Building2,
  Code2,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function BentoFeaturesSection() {
  return (
    <section id="features" className="relative z-10 px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(47,233,43,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Key Features
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent leading-tight">
            Everything you need to secure the offer.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Built for campus placement season. Get clear insights and honest feedback on your coding skills.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Bento Card 1: AI Readiness Engine (Wide: 7 cols) */}
          <div className="md:col-span-7 rounded-2xl sm:rounded-3xl border border-border bg-card/90 p-5 sm:p-7 md:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all" />

            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Overall Readiness
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                Overall Readiness Score (0-100)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6 max-w-md leading-relaxed">
                More than just counting solved questions. We check question difficulty, streaks, contest ratings, and projects to show how ready you are.
              </p>

              {/* Interactive Visual Preview Box */}
              <div className="rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 sm:p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Your Readiness Score</span>
                    <div className="text-2xl sm:text-3xl font-black text-foreground flex flex-wrap items-center gap-2">
                      87.4 <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">Top Companies Ready</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Percentile</span>
                    <div className="text-lg sm:text-xl font-bold text-foreground">Top 4.8%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Coding Practice (LeetCode 412 solved)</span>
                      <span className="font-mono text-primary font-bold">91%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Contest Rating (Codeforces 1540)</span>
                      <span className="font-mono text-amber-500 font-bold">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Projects &amp; Code (GitHub 142 commits)</span>
                      <span className="font-mono text-primary font-bold">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Topic Mastery & Weak Spots (5 cols) */}
          <div className="md:col-span-5 rounded-2xl sm:rounded-3xl border border-border bg-card/90 p-5 sm:p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Radar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Topic Check
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                Topic Strengths &amp; Weak Areas
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                Highlights the exact topics that need practice so you can walk into technical interviews with confidence.
              </p>

              {/* Topic Bars */}
              <div className="space-y-2.5 sm:space-y-3 rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Binary Trees & BST</span>
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-bold">96% Strong</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Graphs & Shortest Path</span>
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-blue-700 dark:text-blue-400 font-bold">88% Solid</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Dynamic Programming</span>
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-400 font-bold">68% Practice</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Tries & Bit Manipulation</span>
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/25 text-rose-700 dark:text-rose-400 font-bold">54% Weak Area</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-amber-500 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>12 questions recommended to close the gap</span>
            </div>
          </div>

          {/* Bento Card 3: Spaced Repetition Calendar (5 cols) */}
          <div className="md:col-span-5 rounded-2xl sm:rounded-3xl border border-border bg-card/90 p-5 sm:p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Core Subjects
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                Daily Revision Schedule
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                Review core topics daily so you remember important concepts in your technical interviews.
              </p>

              {/* Flashcard pills */}
              <div className="space-y-2.5 rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-foreground font-medium truncate">OS: Paging vs Segmentation</span>
                  </div>
                  <span className="text-muted-foreground text-[10px] shrink-0">Due today</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-foreground font-medium truncate">DBMS: B+ Tree Indexing</span>
                  </div>
                  <span className="text-muted-foreground text-[10px] shrink-0">Due tomorrow</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-foreground font-medium truncate">CN: TCP 3-Way Handshake</span>
                  </div>
                  <span className="text-muted-foreground text-[10px] shrink-0">Due in 3 days</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>CS Mastery Level:</span>
              <span className="font-bold text-foreground">88% (42/48 Topics)</span>
            </div>
          </div>

          {/* Bento Card 4: Company Match & Tier Cutoffs (7 cols) */}
          <div className="md:col-span-7 rounded-2xl sm:rounded-3xl border border-border bg-card/90 p-5 sm:p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Target Companies
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                Company Match Scores
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6 max-w-md leading-relaxed">
                See where you stand right now. We check your stats against real interview requirements from top tech companies and IT firms.
              </p>

              {/* Companies cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-3.5 sm:p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Google / Amazon</div>
                  <div className="text-xl sm:text-2xl font-black text-primary mb-1">92%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Tier-1 Match
                  </span>
                </div>

                <div className="rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-3.5 sm:p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Oracle / Cisco</div>
                  <div className="text-xl sm:text-2xl font-black text-primary mb-1">98%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Tier-2 Match
                  </span>
                </div>

                <div className="rounded-xl sm:rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-3.5 sm:p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Accenture / TCS</div>
                  <div className="text-xl sm:text-2xl font-black text-primary mb-1">100%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Ready to Apply
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>Company requirements updated from real campus placement drives</span>
              <span className="text-primary font-bold">15+ Companies Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
