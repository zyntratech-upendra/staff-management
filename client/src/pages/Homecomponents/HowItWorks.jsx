// src/components/HowItWorks.jsx
import React, { useEffect, useRef } from "react";
import { UserPlus, Settings, CheckCircle, TrendingUp } from "lucide-react";

/**
 * HowItWorks.jsx — Final (hero-like background + matching colors)
 * - Background blobs & rect match HeroAnimated: left ellipse + right rect + subtle particles
 * - Heading uses the same teal->cyan gradient clip and animated shift as Hero
 * - Cards: glassy ribbon style, numbers removed, larger icons, reduced padding
 * - IntersectionObserver entrance, desktop hover elevation, respects reduced motion
 *
 * Requirements: Tailwind CSS + lucide-react
 */

const steps = [
  {
    icon: UserPlus,
    title: "Create account",
    description:
      "Sign up and configure your organization in minutes — quick setup for immediate use.",
    gradientFrom: "#06b6d4",
    gradientTo: "#0ea5a4",
  },
  {
    icon: Settings,
    title: "Tailor settings",
    description:
      "Add teams, roles and payroll rules so the platform matches how your organization operates.",
    gradientFrom: "#06b6d4",
    gradientTo: "#3b82f6",
  },
  {
    icon: CheckCircle,
    title: "Start tracking",
    description:
      "Capture attendance, monitor shifts and keep accurate records — real-time and historical.",
    gradientFrom: "#7c3aed",
    gradientTo: "#06b6d4",
  },
  {
    icon: TrendingUp,
    title: "Act on insights",
    description:
      "Use dashboards and reports to optimize staffing, reduce costs and scale with confidence.",
    gradientFrom: "#10b981",
    gradientTo: "#06b6d4",
  },
];

export default function HowItWorks() {
  const refs = useRef([]);
  const decorRef = useRef(null);

  // Inject shared keyframes (idempotent)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("howitworks-hero-like-styles")) return;
    const s = document.createElement("style");
    s.id = "howitworks-hero-like-styles";
    s.innerHTML = `
      @keyframes hw-float { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
      @keyframes hw-pop { 0% { transform: scale(.98); opacity: 0 } 70% { transform: scale(1.02); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
      @keyframes hw-spin-slow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      @keyframes hw-gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @media (prefers-reduced-motion: reduce) {
        .hw-float, .hw-pop, .hw-spin-slow, .hw-animate-gradient, [data-anim] { animation: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  // Parallax for right decor
  useEffect(() => {
    const el = decorRef.current;
    if (!el) return;
    function onMove(e) {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 8;
      const ny = (e.clientY / innerHeight - 0.5) * 8;
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Reveal on scroll (staggered)
  useEffect(() => {
    const nodes = (refs.current || []).filter(Boolean);
    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            const idx = Number(el.datasetIdx || 0);
            el.style.transition = `opacity 600ms cubic-bezier(.2,.9,.2,1) ${idx * 80}ms, transform 600ms cubic-bezier(.2,.9,.2,1) ${idx * 80}ms`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0) scale(1)";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach((n, i) => {
      n.style.opacity = "0";
      n.style.transform = "translateY(20px) scale(.995)";
      n.datasetIdx = i;
      obs.observe(n);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-gradient-to-b from-slate-50 via-white to-cyan-50 py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Hero-like decorative background (left ellipse + right rect) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* left soft ellipse (matches hero) */}
        <svg
          className="absolute left-[-6%] top-[-10%] w-[560px] h-[560px] opacity-28 blur-3xl hidden lg:block"
          viewBox="0 0 400 400"
          aria-hidden
        >
          <defs>
            <linearGradient id="how_bg_g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="200" ry="150" fill="url(#how_bg_g1)" />
        </svg>

        {/* right rounded rect (hero-like) */}
        <svg
          className="absolute right-[-4%] bottom-[-8%] w-[460px] h-[460px] opacity-22 blur-2xl hidden lg:block"
          viewBox="0 0 400 400"
          aria-hidden
        >
          <defs>
            <linearGradient id="how_bg_g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="400" rx="110" fill="url(#how_bg_g2)" />
        </svg>

        {/* subtle morph blob (smaller, near right) */}
        <div
          ref={decorRef}
          className="absolute right-[-6%] top-12 w-[420px] h-[320px] lg:w-[520px] lg:h-[420px] hidden lg:block"
          aria-hidden
        >
          <svg viewBox="0 0 480 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="how_morph_g" x1="0" x2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <path
              d="M0 120 C80 40,160 20,240 60 C320 100,400 80,480 120 L480 300 L0 300 Z"
              fill="url(#how_morph_g)"
              opacity="0.14"
              style={{ transformOrigin: "center", animation: "hw-float 4200ms ease-in-out infinite" }}
            />

            <circle
              cx="360"
              cy="60"
              r="48"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="6"
              fill="none"
              style={{ animation: "hw-spin-slow 28s linear infinite" }}
            />
          </svg>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading (uses same gradient clip as hero for visual continuity) */}
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
            Get your team moving —{" "}
            <span
              className="bg-clip-text text-transparent hw-animate-gradient"
              style={{
                backgroundImage: "linear-gradient(90deg,#06b6d4,#0ea5a4)",
                backgroundSize: "200% 200%",
                animation: "hw-gradientShift 6s ease infinite",
              }}
            >
              simple, fast, visual
            </span>
          </h2>

          <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            From setup to insight — four focused actions that get your workforce productive quickly.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const gradientStyle = {
              backgroundImage: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
            };

            return (
              <article
                key={step.title}
                ref={(el) => (refs.current[idx] = el)}
                data-anim
                data-idx={idx}
                tabIndex={0}
                aria-label={step.title}
                className="relative rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100/60 shadow-[0_18px_50px_rgba(2,6,23,0.06)] focus:outline-none"
                style={{
                  padding: "0.85rem",
                  minHeight: 230,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {/* mobile top band */}
                <div className="flex lg:hidden items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center text-white font-semibold shadow"
                    style={gradientStyle}
                    aria-hidden
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  </div>
                </div>

                {/* desktop row */}
                <div className="flex items-start gap-4 lg:gap-5">
                  <div
                    className="hidden lg:grid place-items-center rounded-2xl shadow-md hw-pop"
                    style={{
                      width: 80,
                      height: 80,
                      ...gradientStyle,
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="hidden lg:block text-xl sm:text-2xl font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* CTA row */}
                <div className="mt-auto flex items-center gap-3">
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2 text-teal-700 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition"
                    aria-label={`Learn more about ${step.title}`}
                  >
                    Learn more
                  </a>

                  <div className="ml-auto hidden sm:inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "rgba(6,182,212,0.18)" }} />
                  </div>
                </div>

                {/* corner accent */}
                <div className="hidden lg:block absolute -right-4 -top-4 w-14 h-14 pointer-events-none">
                  <svg viewBox="0 0 56 56" className="w-full h-full" aria-hidden>
                    <defs>
                      <linearGradient id={`how_step_accent_${idx}`} x1="0" x2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.06" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="56" height="56" rx="12" fill={`url(#how_step_accent_${idx})`} />
                  </svg>
                </div>

                {/* hover micro-interaction */}
                <style>{`
                  [data-anim]:hover { transform: translateY(-8px) scale(1.01); transition: transform 260ms cubic-bezier(.2,.9,.2,1); box-shadow: 0 28px 70px rgba(2,6,23,0.12); }
                  @media (prefers-reduced-motion: reduce) {
                    [data-anim]:hover { transform: none !important; transition: none !important; box-shadow: 0 12px 30px rgba(2,6,23,0.06) !important; }
                  }
                `}</style>
              </article>
            );
          })}
        </div>
      </div>

      {/* particles (lightweight, desktop only) */}
      <div className="pointer-events-none absolute inset-0 -z-5">
        <div className="hidden lg:block absolute left-1/4 top-10 w-2 h-2 rounded-full bg-white/85 opacity-85 animate-[hw-float_3s_ease-in-out_infinite]" />
        <div className="hidden lg:block absolute right-1/3 bottom-20 w-2 h-2 rounded-full bg-white/70 opacity-70 animate-[hw-float_3.6s_ease-in-out_200ms_infinite]" />
        <div className="hidden lg:block absolute left-3/4 top-40 w-1.5 h-1.5 rounded-full bg-white/60 opacity-70 animate-[hw-float_4s_ease-in-out_400ms_infinite]" />
      </div>

      {/* fallback keyframes (inline) */}
      <style>{`
        @keyframes hw-float { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
        @keyframes hw-pop { 0% { transform: scale(.98); opacity: 0 } 70% { transform: scale(1.02); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
        @keyframes hw-spin-slow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes hw-gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @media (prefers-reduced-motion: reduce) {
          .hw-float, .hw-pop, .hw-spin-slow, .hw-animate-gradient, [data-anim] { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
