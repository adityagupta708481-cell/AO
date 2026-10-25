import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  LogIn,
  Sparkles,
  Flame,
  Building2,
  Code2,
  Target,
  Menu,
  X,
} from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicHero } from '@/components/ui/cinematic-landing-hero';
import CompanyMarquee from '@/components/landing/CompanyMarquee';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BentoFeaturesSection from '@/components/landing/BentoFeaturesSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import StudentProofSection from '@/components/landing/StudentProofSection';
import FaqSection from '@/components/landing/FaqSection';
import ClosingCtaSection from '@/components/landing/ClosingCtaSection';
import LandingFooter from '@/components/landing/LandingFooter';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AlgoOrbitLogo from '@/components/ui/AlgoOrbitLogo';

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const isOver = window.scrollY > 40;
      setScrolled((prev) => (prev !== isOver ? isOver : prev));
    };
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(targetId);
    if (!target) return;

    // Check if hero ScrollTrigger is active and if we are before its unpin point
    const heroTrigger = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getById('hero-scroll') : null;
    let extraPinOffset = 0;
    if (heroTrigger && window.scrollY < heroTrigger.end) {
      extraPinOffset = heroTrigger.end - Math.max(window.scrollY, heroTrigger.start);
    }

    const navOffset = 76;
    const targetY = target.getBoundingClientRect().top + window.scrollY + extraPinOffset - navOffset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[100] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-all duration-300">
      <nav
        aria-label="Primary"
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-2xl border transition-all duration-300 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 ${
          scrolled
            ? 'border-border/80 bg-card/85 backdrop-blur-xl shadow-lg'
            : 'border-border/40 bg-card/40 backdrop-blur-md'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 no-underline text-foreground group" id="landing-brand">
          <AlgoOrbitLogo size={34} variant="badge" className="shadow-[0_4px_14px_var(--primary-glow)]" />
          <div className="font-extrabold tracking-tight text-base sm:text-[1.12rem] leading-none text-foreground flex items-baseline">
            <span>Algo</span>
            <span className="bg-gradient-to-r from-emerald-500 via-[#2fe92b] to-[#10b981] dark:from-[#3efd3a] dark:to-[#10b981] bg-clip-text text-transparent ml-0.5">
              Orbit
            </span>
          </div>
        </Link>

        {/* Center Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            className="hover:text-foreground transition-colors no-underline cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            className="hover:text-foreground transition-colors no-underline cursor-pointer"
          >
            Platform Features
          </a>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, '#faq')}
            className="hover:text-foreground transition-colors no-underline cursor-pointer"
          >
            FAQ
          </a>
        </div>

        {/* Right CTA & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <ThemeToggle variant="sm" />
          <Link
            to="/login"
            id="landing-nav-signin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors no-underline"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            id="landing-nav-getstarted"
            className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-primary-foreground no-underline bg-gradient-to-r from-[var(--primary)] to-[#15803d] shadow-[0_4px_14px_var(--primary-glow)] hover:shadow-[0_6px_20px_var(--primary-glow)] hover:-translate-y-px transition-all"
          >
            Get started <ArrowRight size={14} className="sm:w-[15px] sm:h-[15px]" />
          </Link>

          {/* Mobile Menu Toggle Button (Min 44x44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mx-auto max-w-7xl mt-2 rounded-2xl border border-border bg-card/95 backdrop-blur-2xl p-4 shadow-2xl flex flex-col space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors no-underline flex items-center cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors no-underline flex items-center cursor-pointer"
          >
            Platform Features
          </a>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, '#faq')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors no-underline flex items-center cursor-pointer"
          >
            FAQ
          </a>
          <div className="pt-2 border-t border-border flex items-center justify-between px-3.5 py-2 min-h-[44px]">
            <span className="text-xs font-semibold text-muted-foreground">Color Theme</span>
            <ThemeToggle variant="sm" />
          </div>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-center text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors no-underline flex items-center justify-center"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-center text-sm font-bold text-primary-foreground bg-gradient-to-r from-[var(--primary)] to-[#15803d] shadow-[0_4px_14px_var(--primary-glow)] no-underline flex items-center justify-center gap-1.5"
            >
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroCtas() {
  return (
    <>
      <Link
        to="/register"
        id="hero-cta-register"
        aria-label="Create your free AlgoOrbit account"
        className="btn-modern-light w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[1.25rem] group no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform active:scale-[0.98]"
      >
        <div className="text-left">
          <div className="text-[10px] font-bold tracking-wider uppercase mb-[-2px] opacity-90">Free for students</div>
          <div className="text-lg sm:text-xl font-bold leading-none tracking-tight">Get started</div>
        </div>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
      <Link
        to="/login"
        id="hero-cta-login"
        aria-label="Sign in to AlgoOrbit"
        className="btn-modern-dark w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[1.25rem] group no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform active:scale-[0.98]"
      >
        <LogIn className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" aria-hidden="true" />
        <div className="text-left">
          <div className="text-[10px] font-bold tracking-wider uppercase mb-[-2px] opacity-75">Already preparing?</div>
          <div className="text-lg sm:text-xl font-bold leading-none tracking-tight">Sign in</div>
        </div>
      </Link>
    </>
  );
}

export default function Landing() {
  return (
    <div className="relative overflow-x-clip w-full min-h-screen bg-transparent text-foreground font-sans">
      <LandingNav />

      {/* 1. Cinematic Hero with MacBook Pro Mockup and 3D Tilt */}
      <CinematicHero
        brandName="AlgoOrbit"
        tagline1="Prep smarter,"
        tagline2="land the offer."
        cardHeading="Placement readiness, decoded."
        cardDescription={
          <>
            <span className="card-val-heading font-extrabold">AlgoOrbit</span> syncs your LeetCode, Codeforces and GitHub
            activity, then uses AI to score your readiness, surface weak topics, and match you with the companies
            you're truly ready for.
          </>
        }
        metricValue={87}
        metricLabel="Readiness Score"
        laptopEyebrow="This week"
        laptopTitle="Readiness"
        laptopInitials="AO"
        laptopItems={[
          {
            icon: <Code2 className="w-4 h-4" aria-hidden="true" />,
            title: '412 problems solved',
            subtitle: '+18 synced this week',
            tone: 'blue',
          },
          {
            icon: <Target className="w-4 h-4" aria-hidden="true" />,
            title: 'Tier-1 product ready',
            subtitle: 'Next: Dynamic Programming',
            tone: 'emerald',
          },
        ]}
        badges={[
          {
            icon: <Flame className="w-4 h-4 text-amber-300" aria-hidden="true" />,
            title: '45-day streak',
            subtitle: 'Daily goal crushed',
          },
          {
            icon: <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />,
            title: 'Company match',
            subtitle: '92% fit · Tier-1',
          },
        ]}
        ctaHeading="Your offer starts here."
        ctaDescription="Connect your coding profiles in under a minute and get an AI-powered placement readiness report today."
        ctaActions={<HeroCtas />}
      />

      {/* 2. Recruiter Companies & Supported Hubs Marquee */}
      <CompanyMarquee />

      {/* 3. Three-Step How It Works Visual Flow */}
      <HowItWorksSection />

      {/* 4. High-Density Bento Grid Features */}
      <BentoFeaturesSection />

      {/* 5. Traditional Grind vs AlgoOrbit Comparison */}
      <ComparisonSection />

      {/* 6. Real Student Outcomes & Metrics Strip */}
      <StudentProofSection />

      {/* 7. Interactive FAQ Accordion */}
      <FaqSection />

      {/* 8. High-Impact Closing CTA Banner */}
      <ClosingCtaSection />

      {/* 9. Comprehensive Modern Footer */}
      <LandingFooter />
    </div>
  );
}
