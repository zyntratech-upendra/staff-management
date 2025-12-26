// src/components/Features.jsx
import React, { useEffect, useRef } from "react";
import {
  Shield,
  Building,
  Users,
  User,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
} from "lucide-react";

/**
 * Features.jsx
 * - Background & heading colors matched to HeroAnimated.jsx
 * - Decorative blobs use same teal/cyan + purple accents
 * - IntersectionObserver reveal + tilt-on-hover retained
 * - Increased typography, reduced inner padding, responsive
 *
 * Requirements: Tailwind CSS + lucide-react
 */

const roles = [
  {
    title: "Main Admin",
    icon: Shield,
    color: "blue",
    features: [
      "Register and manage companies",
      "Enable/disable company accounts",
      "View platform statistics",
      "Manage admin profile",
      "Monitor system activity",
    ],
  },
  {
    title: "Company Account",
    icon: Building,
    color: "cyan",
    features: [
      "Register employees and supervisors",
      "Define salary structures",
      "View attendance records",
      "Generate salary and payslips",
      "Manage company profile",
    ],
  },
  {
    title: "Supervisor",
    icon: Users,
    color: "emerald",
    features: [
      "View assigned employees",
      "Mark daily attendance",
      "Update attendance records",
      "View attendance history",
      "Generate reports",
    ],
  },
  {
    title: "Employee",
    icon: User,
    color: "amber",
    features: [
      "View personal attendance",
      "View salary and payslips",
      "View documents",
      "Update profile information",
      "Download reports",
    ],
  },
];

const highlights = [
  {
    icon: Clock,
    title: "Attendance Tracking",
    description:
      "Real-time attendance monitoring with detailed history and exportable reporting.",
    color: "teal",
  },
  {
    icon: DollarSign,
    title: "Salary Management",
    description:
      "Automated salary calculations, payslip generation and export-ready files.",
    color: "cyan",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Store, tag and grant access to employee documents securely.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Dashboards, trends, and insights for smarter decisions.",
    color: "indigo",
  },
];

const tailwindColorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  teal: { bg: "bg-teal-50", text: "text-teal-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
};

export default function Features() {
  const roleRefs = useRef([]);
  const highlightRefs = useRef([]);
  const decorRef = useRef(null);

  // subtle parallax so the background flows with hero
  useEffect(() => {
    const el = decorRef.current;
    if (!el) return;
    function onMove(e) {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 6;
      const ny = (e.clientY / innerHeight - 0.5) * 6;
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // IntersectionObserver reveal
  useEffect(() => {
    const allTargets = [...(roleRefs.current || []), ...(highlightRefs.current || [])].filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.style.transitionProperty = "opacity, transform, box-shadow";
            el.style.transitionDuration = "600ms";
            el.style.transitionTimingFunction = "cubic-bezier(.2,.9,.2,1)";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 12px 36px rgba(2,6,23,0.06)";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    allTargets.forEach((t) => {
      if (t) {
        t.style.opacity = "0";
        t.style.transform = "translateY(20px)";
        obs.observe(t);
      }
    });

    return () => obs.disconnect();
  }, []);

  // tilt micro-interaction (desktop)
  useEffect(() => {
    const cards = roleRefs.current.filter(Boolean);
    const handlers = [];

    function isDesktop() {
      return window.innerWidth >= 1024;
    }

    cards.forEach((card) => {
      if (!card) return;
      const onMove = (e) => {
        if (!isDesktop()) return;
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        const ry = dx * 6;
        const rx = dy * -6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
      };
      const onLeave = () => {
        card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push({ card, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // injected keyframes (idempotent)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("features-decor-styles")) return;
    const s = document.createElement("style");
    s.id = "features-decor-styles";
    s.innerHTML = `
      @keyframes float-slow { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
      @keyframes spin-very-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { .morph-path, .float-slow, .spin-very-slow { animation: none !important; } }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <section
      id="features"
      className="relative w-full bg-gradient-to-b from-slate-50 via-white to-cyan-50 py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Decorative background (matches hero theme) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* left soft radial */}
        <svg className="hidden lg:block absolute left-[-6%] top-[-10%] w-[560px] h-[560px] opacity-28 blur-3xl" viewBox="0 0 500 500" aria-hidden>
          <defs>
            <linearGradient id="featBg1" x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <ellipse cx="250" cy="250" rx="240" ry="180" fill="url(#featBg1)" />
        </svg>

        {/* right morphing shape */}
        <div ref={decorRef} className="absolute right-[-6%] top-6 lg:top-12 w-[420px] h-[320px] lg:w-[520px] lg:h-[420px]">
          <svg viewBox="0 0 480 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
              <linearGradient id="featG2" x1="0" x2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <path
              className="morph-path"
              d="M0 100 C60 20,140 0,220 30 C300 60,360 40,480 80 L480 300 L0 300 Z"
              fill="url(#featG2)"
              opacity="0.18"
              style={{ transformOrigin: "center", animation: "float-slow 4200ms ease-in-out infinite" }}
            />
            <circle cx="360" cy="60" r="48" stroke="rgba(255,255,255,0.14)" strokeWidth="6" fill="none" style={{ animation: "spin-very-slow 28s linear infinite" }} />
          </svg>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500">features</span> for every role
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-slate-600">
            Role-based access control ensures every user sees the right tools and information to manage work effectively.
          </p>
        </div>

        {/* Roles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12 lg:mb-16">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            const colors = tailwindColorMap[role.color] || tailwindColorMap.blue;
            return (
              <article
                key={role.title}
                ref={(el) => (roleRefs.current[idx] = el)}
                className="relative bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(2,6,23,0.04)] focus:outline-none"
                tabIndex={0}
                aria-label={role.title}
                style={{
                  padding: "0.85rem", // reduced padding
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.bg} rounded-xl w-16 h-16 flex items-center justify-center shrink-0`}>
                    <Icon className={`${colors.text} w-8 h-8`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">{role.title}</h3>

                    <ul className="space-y-2 text-slate-600 text-base leading-relaxed">
                      {role.features.map((f, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="mt-0.5 shrink-0 text-emerald-500">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="text-base">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* decorative corner accent for large screens */}
                <div className="hidden lg:block absolute -right-4 -top-4 w-16 h-16 pointer-events-none">
                  <svg viewBox="0 0 60 60" className="w-full h-full" aria-hidden>
                    <defs>
                      <linearGradient id={`grad-role-${idx}`} x1="0" x2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="60" height="60" rx="12" fill={`url(#grad-role-${idx})`} />
                  </svg>
                </div>
              </article>
            );
          })}
        </div>

        {/* Highlights card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 lg:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">Everything you need in one place</h3>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools to manage your entire workforce — from attendance to payroll and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              const c = tailwindColorMap[h.color] || tailwindColorMap.teal;
              return (
                <div
                  key={h.title}
                  ref={(el) => (highlightRefs.current[i] = el)}
                  className="relative bg-white rounded-2xl p-4 sm:p-5 lg:p-6 text-center shadow-[0_6px_18px_rgba(2,6,23,0.04)]"
                >
                  <div
                    className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl grid place-items-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${c.text}12, ${c.text}06)` }}
                    aria-hidden
                  >
                    <Icon className="w-10 h-10 sm:w-11 sm:h-11 text-teal-600" />
                  </div>

                  <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{h.title}</h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{h.description}</p>

                  {/* subtle animated dots */}
                  <div className="absolute left-4 bottom-4 flex gap-1">
                    <span className="w-2 h-2 bg-teal-200 rounded-full" style={{ animation: "float-slow 2600ms ease-in-out infinite" }} />
                    <span className="w-2 h-2 bg-slate-200 rounded-full" style={{ animation: "float-slow 3200ms ease-in-out 200ms infinite" }} />
                    <span className="w-2 h-2 bg-teal-100 rounded-full" style={{ animation: "float-slow 3800ms ease-in-out 420ms infinite" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* internal animation styles */}
      <style>{`
        @keyframes float-slow { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes spin-very-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .morph-path, [style*="animation"] { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
