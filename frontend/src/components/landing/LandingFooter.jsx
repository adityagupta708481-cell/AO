import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Heart } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import AlgoOrbitLogo from '../ui/AlgoOrbitLogo';

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-border bg-card/90 text-muted-foreground text-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand Col (2 cols on tablet and desktop) */}
          <div className="sm:col-span-2 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline text-foreground group">
              <AlgoOrbitLogo size={32} variant="badge" className="shadow-[0_2px_10px_var(--primary-glow)]" />
              <div className="font-extrabold tracking-tight text-lg text-foreground flex items-baseline">
                <span>Algo</span>
                <span className="bg-gradient-to-r from-emerald-500 via-[#2fe92b] to-[#10b981] dark:from-[#3efd3a] dark:to-[#10b981] bg-clip-text text-transparent ml-0.5">
                  Orbit
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Smart placement preparation and readiness tracking for college students preparing for technical interviews.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All sync services running smoothly</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">Features</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs list-none p-0 m-0">
              <li>
                <Link to="/register" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  AI Readiness Insights
                </Link>
              </li>
              <li>
                <Link to="/register" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Skill Mastery Chart
                </Link>
              </li>
              <li>
                <Link to="/register" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Daily Revision Cards
                </Link>
              </li>
              <li>
                <Link to="/register" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Company Targets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">Integrations</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs list-none p-0 m-0">
              <li className="flex items-center gap-1.5 text-muted-foreground py-0.5">
                <span>LeetCode</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground py-0.5">
                <span>Codeforces</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground py-0.5">
                <span>GitHub</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground py-0.5">
                <span>HackerRank</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">Beta</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground py-0.5">
                <span>CodeChef</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">Beta</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">Account</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs list-none p-0 m-0">
              <li>
                <Link to="/login" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#faq" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="py-1 inline-block hover:text-foreground transition-colors no-underline text-muted-foreground">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} AlgoOrbit. Built for students navigating campus placement season.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <ThemeToggle variant="segmented" />
            <span>Free for College Students</span>
            <span>No Passwords Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
