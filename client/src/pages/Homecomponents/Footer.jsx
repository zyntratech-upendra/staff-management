// src/components/Footer.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Footer.jsx — solid background version
 *
 * - Gradient removed per request: footer now uses a solid background color
 *   that matches the navbar (teal-600) for consistent visual identity.
 * - Decorative accents retained (soft white overlays) but no background
 *   gradient on the root element.
 * - All other functionality (newsletter, links, responsiveness, back-to-top)
 *   preserved.
 *
 * Requires Tailwind CSS + lucide-react + react-router-dom Link.
 */

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "ok" | "error"
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (status === "ok") {
      const t = setTimeout(() => {
        setStatus(null);
        setEmail("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  function handleSubscribe(e) {
    e.preventDefault();
    if (submitting) return;
    setStatus(null);

    const mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRe.test(email.trim())) {
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStatus("ok");
    }, 800);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative overflow-hidden bg-teal-600 text-white pt-20 sm:pt-24 lg:pt-28 pb-10 lg:pb-16">
      {/* Decorative background accents (soft, subtle; kept pointer-events-none) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* left soft ellipse */}
        <svg className="absolute left-[-10%] top-[-18%] w-[680px] h-[680px] opacity-10 blur-3xl hidden lg:block" viewBox="0 0 400 400" aria-hidden>
          <defs>
            <linearGradient id="f_bg_left_nav" x1="0" x2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="200" ry="150" fill="url(#f_bg_left_nav)" />
        </svg>

        {/* right rounded rect */}
        <svg className="absolute right-[-6%] bottom-[-12%] w-[620px] h-[620px] opacity-8 blur-2xl hidden lg:block" viewBox="0 0 400 400" aria-hidden>
          <defs>
            <linearGradient id="f_bg_right_nav" x1="0" x2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="400" rx="110" fill="url(#f_bg_right_nav)" />
        </svg>

        {/* small morph blob */}
        <div className="hidden lg:block absolute right-[-3%] top-8 w-[380px] h-[260px] opacity-9" aria-hidden>
          <svg viewBox="0 0 420 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="f_morph_nav" x1="0" x2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d="M0 120 C80 40,160 20,240 60 C320 100,360 80,420 120 L420 300 L0 300 Z"
              fill="url(#f_morph_nav)"
              opacity="0.08"
              style={{ animation: "footerFloatNav 7000ms ease-in-out infinite" }}
            />
          </svg>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Branding + newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm shadow-sm">
                <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden className="text-white">
                  <defs>
                    <linearGradient id="logo_grad_nav" x1="0" x2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  <rect width="24" height="24" rx="6" fill="url(#logo_grad_nav)" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">StaffHub</div>
                <div className="text-sm text-slate-100/80">Workforce made simple</div>
              </div>
            </div>

            <p className="text-slate-100/90 mb-5 max-w-[36rem]">
              Trusted attendance, payroll and analytics tools for institutions and small businesses. Built to scale and easy to manage.
            </p>

            <form onSubmit={handleSubscribe} className="w-full" aria-label="Subscribe to newsletter">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-lg border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/95 text-slate-800 placeholder-slate-400"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "email-error" : undefined}
                  />
                </div>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-4 py-3 rounded-lg shadow-md transition ${
                    submitting ? "opacity-80 pointer-events-none" : ""
                  }`}
                  aria-label="Subscribe"
                >
                  {submitting ? "Sending..." : "Subscribe"}
                </button>
              </div>

              <div className="mt-3 min-h-[1.5rem]">
                {status === "ok" && (
                  <div role="status" className="text-sm text-emerald-200">
                    Thanks — you're subscribed!
                  </div>
                )}
                {status === "error" && (
                  <div id="email-error" role="alert" className="text-sm text-rose-200">
                    Please enter a valid email address.
                  </div>
                )}
              </div>
            </form>

            <div className="mt-7 flex items-center gap-4">
              <a href="mailto:hello@staffhub.example" className="inline-flex items-center gap-3 text-slate-100/95 hover:text-white transition" aria-label="Email">
                <Mail className="w-5 h-5" />
                <span className="text-sm">hello@staffhub.example</span>
              </a>

              <a href="tel:+911234567890" className="inline-flex items-center gap-3 text-slate-100/95 hover:text-white transition" aria-label="Phone">
                <Phone className="w-5 h-5" />
                <span className="text-sm">+91 12 3456 7890</span>
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a aria-label="Facebook" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="#">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a aria-label="Twitter" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="#">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a aria-label="LinkedIn" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="#">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a aria-label="Instagram" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="#">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a aria-label="YouTube" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" href="#">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick links / Product / Company */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <nav aria-label="Product" className="flex flex-col">
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="flex flex-col gap-3 text-slate-100/85">
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="#features">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Features
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="#how-it-works">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    How it works
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/pricing">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/integrations">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Integrations
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Company" className="flex flex-col">
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="flex flex-col gap-3 text-slate-100/85">
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/about">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    About us
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/careers">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/blog">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-3 hover:text-white transition" to="/contact">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Address / hours */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white mb-4">Contact & Office</h4>
            <address className="not-italic text-slate-100/85 text-sm flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-white/80 mt-1" />
                <div>SSR Degree College, Jaganadha Puram, Machilipatnam, Andhra Pradesh 521001</div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-white/80" />
                <a href="tel:+911234567890" className="hover:text-white transition">
                  +91 12 3456 7890
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-white/80" />
                <a href="mailto:hello@staffhub.example" className="hover:text-white transition">
                  hello@staffhub.example
                </a>
              </div>

              <div className="pt-1 text-xs text-white/70">Mon–Fri: 9:00 — 18:00 IST</div>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/12 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-white/80">© {new Date().getFullYear()} StaffHub — All rights reserved.</div>

            <div className="flex items-center gap-4">
              <Link to="/terms" className="text-sm text-white/80 hover:text-white transition">Terms</Link>
              <Link to="/privacy" className="text-sm text-white/80 hover:text-white transition">Privacy</Link>
              <a href="/sitemap.xml" className="text-sm text-white/80 hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* back to top floating control */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed right-4 bottom-6 z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-700 shadow-lg hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Inline styles / keyframes (idempotent + respects reduced-motion) */}
      <style>{`
        @keyframes footerFloatNav {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"], svg[style*="animation"], .animate-* { animation: none !important; transition: none !important; }
        }

        /* Small responsive tweak for inputs on very small screens */
        @media (max-width: 420px) {
          input#footer-email { padding-left: 0.75rem; padding-right: 0.75rem; }
        }
      `}</style>
    </footer>
  );
}
