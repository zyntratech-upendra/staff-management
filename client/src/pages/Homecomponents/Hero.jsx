// src/components/HeroAnimated.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  Menu,
  X,
  Grid,
  HelpCircle,
  CreditCard,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * HeroAnimated.jsx (final - decorative visual replaces attendance card)
 * - Full-bleed hero with small side padding so it lines up with navbar
 * - Nav links with icons, mobile menu
 * - Left: headline + CTAs + stat pills
 * - Right: decorative animated SVG shapes + floating micro-icons + particles
 *
 * Notes:
 * - Animations are CSS-first (respect prefers-reduced-motion).
 * - Tailwind required.
 */

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const blobRef = useRef(null);
  const decorRef = useRef(null);

  // subtle parallax effect for decorative group (mouse move)
  useEffect(() => {
    const el = decorRef.current;
    if (!el) return;
    function onMove(e) {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 10; // -5..5
      const ny = (e.clientY / innerHeight - 0.5) * 10;
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features", Icon: Grid },
    { href: "#how-it-works", label: "How It Works", Icon: HelpCircle },
    { href: "#pricing", label: "Pricing", Icon: CreditCard },
  ];

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      {/* decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg className="absolute left-[-6%] top-[-10%] w-[560px] h-[560px] opacity-28 blur-3xl hidden lg:block" viewBox="0 0 400 400" aria-hidden>
          <defs>
            <linearGradient id="bgG1" x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="200" ry="150" fill="url(#bgG1)" />
        </svg>

        <svg className="absolute right-[-4%] bottom-[-8%] w-[460px] h-[460px] opacity-22 blur-2xl hidden lg:block" viewBox="0 0 400 400" aria-hidden>
          <defs>
            <linearGradient id="bgG2" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="400" rx="110" fill="url(#bgG2)" />
        </svg>
      </div>

      {/* NAV */}
      <nav className="relative z-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8"> {/* small padding at ends */}
          <div className="flex items-center justify-between h-20 max-w-[1800px] mx-auto">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                <Building2 className="w-8 h-8 text-teal-500" />
              </div>
              <div className="font-bold text-slate-900 text-xl">StaffHub</div>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ href, label, Icon }) => (
                <a key={label} href={href} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/40 transition">
                  <Icon className="w-6 h-6 text-slate-700" />
                  <span className="text-slate-700 font-medium">{label}</span>
                </a>
              ))}

              <Link to="/login" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/40 transition">
                <LogIn className="w-6 h-6 text-slate-700" />
                <span className="text-slate-700 font-medium">Sign In</span>
              </Link>

              <a href="#features" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold">Get Started</span>
              </a>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className="p-2 rounded-md bg-white/10 hover:bg-white/20"
              >
                {mobileOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="mt-2 mb-4 space-y-3 md:hidden border-t border-slate-100 pt-3 pb-4">
              {navLinks.map(({ href, label, Icon }) => (
                <a key={label} href={href} className="block px-3 py-2 rounded-md text-slate-800 hover:bg-white/30 flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-700" />
                  <span className="font-medium">{label}</span>
                </a>
              ))}

              <Link to="/login" className="block px-3 py-2 rounded-md text-slate-800 hover:bg-white/30 flex items-center gap-3">
                <LogIn className="w-5 h-5 text-slate-700" />
                <span className="font-medium">Sign In</span>
              </Link>

              <div className="px-3">
                <a href="#features" className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 bg-teal-600 text-white rounded-md">
                  <UserPlus className="w-5 h-5" />
                  Get Started
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8"> {/* slightly more padding at ends */}
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20 lg:py-32">

          {/* LEFT: CONTENT */}
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium animate-appear">
                <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none"><path d="M12 2v6M20 12h-6M12 20v-6M4 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Designed for colleges & institutions
              </span>

              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900">
                Streamline your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500 animate-gradient">
                  workforce management
                </span>
              </h1>

              <p className="mt-6 text-xl lg:text-2xl text-slate-600 max-w-2xl">
                Complete staffing solution with attendance tracking, payroll automation and role-based access — built to free up administrators to focus on what matters.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-teal-700 px-5 py-3 rounded-lg border border-teal-100 hover:shadow-sm transition text-lg"
                >
                  Explore features
                </a>

                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-white text-slate-800 px-5 py-3 rounded-lg border border-slate-200 hover:shadow-sm transition text-lg"
                >
                  See pricing
                </a>
              </div>

              {/* stat pills */}
              <div className="mt-10 flex flex-wrap gap-6 items-center">
                <StatPill label="Active staff" value="1,248" accent />
                <StatPill label="Monthly logins" value="46,820" />
                <StatPill label="Avg rating" value="4.6/5" />
              </div>
            </div>
          </div>

          {/* RIGHT: Decorative animated visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div ref={decorRef} className="relative w-[320px] sm:w-[420px] lg:w-[480px]">
              {/* Layered morphing blobs */}
              <MorphBlobs />

              {/* Floating micro-icons */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full">
                  {/* large center icon-ish mark */}
                  <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-400 shadow-xl flex items-center justify-center text-white text-2xl font-bold animate-pop">
                      SH
                    </div>
                  </div>

                  {/* floating icons around */}
                  <FloatingIcon top="6%" left="6%" delay={0} Icon={Grid} />
                  <FloatingIcon top="10%" right="6%" delay={200} Icon={HelpCircle} />
                  <FloatingIcon bottom="8%" left="14%" delay={400} Icon={CreditCard} />
                  <FloatingIcon bottom="16%" right="10%" delay={600} Icon={UserPlus} />
                </div>
              </div>

              {/* subtle particle layer (small dots) */}
              <Particles />

            </div>
          </div>
        </div>
      </div>

      {/* bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      {/* small keyframe styles */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
        @keyframes appear { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-appear { animation: appear .45s ease both; }

        /* morphing blob keyframes */
        @keyframes blob1 {
          0% { r: 100px; transform: translate(0,0) scale(1); }
          33% { r: 110px; transform: translate(-6px, 6px) scale(1.02); }
          66% { r: 95px; transform: translate(6px, -6px) scale(.98); }
          100% { r: 100px; transform: translate(0,0) scale(1); }
        }
        @keyframes blob2 {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.95; }
          50% { transform: translateY(-8px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.95; }
        }
        @keyframes pop {
          0% { transform: scale(.96); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 650ms cubic-bezier(.2,.9,.2,1) both; }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* bar grow used previously (keep if reused) */
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }

        /* Respect user's reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient, .animate-appear, .animate-pop, .floating, .particle { animation: none !important; transform: none !important; }
        }
      `}</style>
    </header>
  );
}

/* ------------------ Subcomponents ------------------ */

function StatPill({ label, value, accent = false }) {
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg ${accent ? "bg-teal-50 text-teal-700" : "bg-white border border-slate-100"} shadow-sm`}>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

/* Morphing blobs: layered SVG shapes with subtle motion */
function MorphBlobs() {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px]">
      <svg viewBox="0 0 400 360" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="mg1" x1="0" x2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="mg2" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* big soft blob */}
        <g transform="translate(200,180)">
          <ellipse className="opacity-95" rx="150" ry="110" cx="0" cy="0" fill="url(#mg1)" style={{ transformOrigin: "center", animation: "blob1 7s ease-in-out infinite" }} />
        </g>

        {/* overlay blob that gently moves */}
        <g transform="translate(260,120)">
          <ellipse rx="90" ry="70" cx="0" cy="0" fill="url(#mg2)" style={{ transformOrigin: "center", animation: "blob2 6s ease-in-out infinite" }} />
        </g>

        {/* subtle spinning ring */}
        <g transform="translate(120,220)">
          <circle r="42" cx="0" cy="0" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="6" style={{ animation: "spinSlow 18s linear infinite" }} />
        </g>

        {/* small accent shapes */}
        <g transform="translate(320,40) rotate(12)">
          <rect x="-18" y="-10" width="36" height="20" rx="6" fill="#06b6d4" opacity="0.08" />
        </g>
        <g transform="translate(40,80) rotate(-8)">
          <rect x="-16" y="-8" width="32" height="16" rx="6" fill="#7c3aed" opacity="0.06" />
        </g>
      </svg>
    </div>
  );
}

/* Floating icon element (positioned absolutely within container) */
function FloatingIcon({ top, left, right, bottom, delay = 0, Icon }) {
  const style = {
    position: "absolute",
    top: top ?? "auto",
    left: left ?? (right ? "auto" : undefined),
    right: right ?? undefined,
    bottom: bottom ?? undefined,
    transform: "translateZ(0)",
    animation: `float 3200ms ${delay}ms ease-in-out infinite`,
  };

  return (
    <div style={style} className="floating">
      <div className="bg-white/95 p-2 rounded-full shadow-md flex items-center justify-center">
        <Icon className="w-5 h-5 text-teal-600" />
      </div>
    </div>
  );
}

/* Simple particle layer - small dots drifting up and down */
function Particles() {
  // Render a few CSS-animated dot elements with staggered delays
  const dots = new Array(10).fill(0).map((_, i) => ({
    left: `${10 + i * 8}%`,
    size: 4 + (i % 3),
    delay: i * 120,
    top: `${10 + (i * 7) % 40}%`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className="particle"
          style={{
            position: "absolute",
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 6px 20px rgba(13,148,136,0.08)",
            opacity: 0.9,
            transform: "translateZ(0)",
            animation: `float ${2800 + (i % 4) * 200}ms ${d.delay}ms ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
