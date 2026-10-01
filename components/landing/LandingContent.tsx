"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Users,
  Trophy,
  Hammer,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { LiveDemoCard } from "@/components/landing/LiveDemoCard";

// ─── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7 drop-shadow-[0_0_8px_var(--color-primary)]", className)} aria-hidden>
      <path
        d="M16 2 L28 9 V23 L16 30 L4 23 V9 Z"
        className="fill-primary/10 stroke-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M17.5 7 L11 17.5 H15 L14.5 25 L21.5 13.5 H16.5 Z" className="fill-primary" />
    </svg>
  );
}

// ─── Scroll-reveal wrapper ─────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20, delay },
    },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingContent() {
  function handleEarlyAccess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    if (!email) return;
    toast.success("Welcome aboard. Check your inbox soon.", {
      style: { background: "var(--color-surface)", border: "1px solid var(--color-primary)", color: "var(--color-text)" }
    });
    form.reset();
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mesh-dark bg-background text-text">
      <Nav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <FinalCta onEarlyAccess={handleEarlyAccess} />
      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. Navigation
// ════════════════════════════════════════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "How it Works", href: "#how" },
    { label: "Explore Projects", href: "/projects/discover" },
  ];

  return (
    <header 
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "bg-[rgba(10,12,20,0.8)] backdrop-blur-md",
        scrolled ? "border-b border-white/5 py-4" : "border-b-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Logo className="transition-transform duration-500 group-hover:rotate-180" />
          <span className="font-heading text-xl font-bold tracking-tight text-text">
            Proofly
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="group flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_var(--color-primary)]"
          >
            Get Started
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Hero (Split Layout)
// ════════════════════════════════════════════════════════════════════════════
function Hero() {
  const lineVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-44 lg:grid-cols-[55%_45%] lg:pt-52">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-0 top-20 size-[500px] rounded-full bg-ai/10 blur-[150px]" />

      {/* Left side copy */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-success backdrop-blur-md mb-8"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Now in Beta
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
          className="font-heading text-[42px] leading-[1.1] tracking-[-0.04em] font-[800] text-text md:text-[68px]"
        >
          <motion.div variants={lineVariants}>Prove Your</motion.div>
          <motion.div variants={lineVariants} className="flex items-center">
            Skills.<motion.span 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                     className="inline-block w-[6px] md:w-[8px] h-[36px] md:h-[60px] bg-primary ml-2 translate-y-1"
                   />
          </motion.div>
          <motion.div variants={lineVariants} className="text-gradient-animated pb-2">
            Find Your Builders.
          </motion.div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-[440px] text-[18px] leading-[1.7] text-[#94A3B8]"
        >
          Stop self-reporting skills that nobody believes. Complete AI-generated
          challenges, earn verified badges, and match with co-builders who trust your proof.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-[28px] py-[14px] text-base font-[600] text-white transition-transform hover:-translate-y-[2px] hover:glow-accent"
          >
            Get Started Free
          </Link>
          <Link
            href="#how"
            className="group inline-flex items-center justify-center gap-2 border border-transparent px-[28px] py-[14px] text-base font-bold text-text transition-all hover:bg-white/5"
          >
            See it in action
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Right side Live Demo Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none"
      >
        <LiveDemoCard />
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Trust strip
// ════════════════════════════════════════════════════════════════════════════
function TrustStrip() {
  const stats = [
    { to: 2400, suffix: "+", label: "Badges Issued" },
    { to: 380, suffix: "+", label: "Projects" },
    { to: 47, suffix: "", label: "Skills" },
    { to: 94, suffix: "%", label: "Accuracy" },
  ];
  return (
    <section className="relative w-full bg-[#10131E] border-y border-white/5">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
        {stats.map((s, i) => (
          <StatBox key={s.label} stat={s} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function StatBox({ stat, delay }: { stat: any, delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-[36px] font-bold text-primary">
        {inView ? <CountUp end={stat.to} duration={2} suffix={stat.suffix} /> : "0" + stat.suffix}
      </p>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. How it works (Scroll linked)
// ════════════════════════════════════════════════════════════════════════════
function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const steps = [
    { num: "01", title: "Accept the Challenge", desc: "Select your skill. Our AI generates a unique, industry-grade challenge that cannot be solved by simply asking ChatGPT.", color: "border-primary" },
    { num: "02", title: "Earn Proof", desc: "Submit your code. Our evaluator models review your architecture, security, and performance to mint your cryptographically secure badge.", color: "border-ai" },
    { num: "03", title: "Find Builders", desc: "Match instantly with founders and hackers whose skills are just as verified as yours. Build the future.", color: "border-success" },
  ];

  return (
    <section id="how" ref={containerRef} className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="text-center mb-24">
        <h2 className="font-heading text-5xl font-black tracking-tight text-text">
          Three steps to undeniable proof.
        </h2>
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Scroll linked SVG line */}
        <div className="absolute left-[24px] md:left-[50px] top-[40px] bottom-[40px] w-1 hidden md:block">
          <svg className="h-full w-[4px]" viewBox="0 0 4 100" preserveAspectRatio="none">
            <line x1="2" y1="0" x2="2" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <motion.line 
              x1="2" y1="0" x2="2" y2="100" 
              stroke="var(--color-primary)" 
              strokeWidth="4" 
              style={{ pathLength }}
            />
          </svg>
        </div>

        <div className="space-y-16">
          {steps.map((s, i) => (
            <div key={s.num} className="relative flex flex-col md:flex-row items-start gap-8 md:gap-16">
              {/* Dot */}
              <div className="hidden md:flex relative z-10 size-6 rounded-full bg-surface border-[4px] border-primary mt-6 ml-[38px] shrink-0" />
              
              <div className={cn("glass-card-v2 relative flex-1 rounded-2xl p-8 border-t-2 overflow-hidden", s.color)}>
                <div className="absolute -right-4 -top-8 font-heading text-[80px] font-bold opacity-[0.06] select-none pointer-events-none">
                  {s.num}
                </div>
                <h3 className="relative z-10 font-heading text-3xl font-bold text-text mb-4">{s.title}</h3>
                <p className="relative z-10 text-base leading-relaxed text-text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Features
// ════════════════════════════════════════════════════════════════════════════
function Features() {
  const features = [
    {
      icon: <Trophy className="size-6 text-primary" />,
      title: "Real-world Tasks",
      desc: "Zero multiple choice. You build working features, APIs, and UIs in your own local environment.",
      gradient: "from-primary/0 via-primary/50 to-primary/0"
    },
    {
      icon: <Layers className="size-6 text-ai" />,
      title: "Multi-modal Evaluation",
      desc: "Our AI agents analyze code quality, read your commit history, and even review visual UI snapshots.",
      gradient: "from-ai/0 via-ai/50 to-ai/0"
    },
    {
      icon: <Users className="size-6 text-amber-500" />,
      title: "Trustless Hiring",
      desc: "Bypass the recruiter wall. When you have a Proofly badge, your capability speaks for itself.",
      gradient: "from-amber-500/0 via-amber-500/50 to-amber-500/0"
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <div className="text-center mb-20">
        <h2 className="font-heading text-5xl font-black tracking-tight text-text">
          Built for hackers.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.15}>
            <div className="glass-card-v2 relative h-full rounded-2xl p-8 flex flex-col group overflow-hidden transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                {f.icon}
              </div>
              <h3 className="font-heading text-xl font-medium text-text mb-3">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {f.desc}
              </p>
              
              {/* Bottom subtle gradient line */}
              <div className={cn("absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r opacity-40 group-hover:opacity-100 transition-opacity", f.gradient)} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Final CTA
// ════════════════════════════════════════════════════════════════════════════
function FinalCta({ onEarlyAccess }: { onEarlyAccess: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[3rem] border border-[#22D3EE]/20 bg-gradient-to-br from-[#10131E] to-[#161A28] px-6 py-24 text-center">
          <h2 className="relative z-10 font-heading text-5xl font-black tracking-tight text-text sm:text-6xl">
            Stop claiming.<br />Start proving.
          </h2>
          
          <form
            onSubmit={onEarlyAccess}
            className="relative z-10 mx-auto mt-12 flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/50 px-6 text-base text-text outline-none backdrop-blur-md transition-all placeholder:text-text-muted focus:border-ai focus:shadow-[0_0_20px_var(--color-ai)]"
            />
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-8 text-base font-bold text-black transition-all hover:scale-105"
            >
              Get Access
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Footer
// ════════════════════════════════════════════════════════════════════════════
function Footer() {
  const links = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "GitHub", href: "https://github.com", external: true },
  ];
  return (
    <footer className="border-t border-white/5 bg-background pb-12 pt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="size-6 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100" />
          <span className="font-heading text-xl font-bold tracking-tight text-text-muted">
            Proofly
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-white"
            >
              {l.label === "GitHub" && <Code2 className="size-4" />}
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      
      <div className="mx-auto mt-16 max-w-7xl border-t border-white/5 px-6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Proofly. Designed for builders.
        </p>
        
        <div className="flex items-center gap-3 text-xs text-text-muted font-medium">
          <span>Powered by</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface px-3 py-1.5 shadow-inner">
            <span className="size-2 rounded-full bg-ai animate-pulse" />
            Claude & Gemini
          </span>
        </div>
      </div>
    </footer>
  );
}
