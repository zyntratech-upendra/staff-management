// src/pages/BookDemo.jsx
import React, { useEffect, useRef } from "react";
import { Calendar, Mail, Phone, Building2, Users, MessageSquare } from "lucide-react";

export default function BookDemo() {
  const revealRefs = useRef([]);

  // Reveal animation
  useEffect(() => {
    const elements = revealRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addToRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50 min-h-screen">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute left-[-10%] top-[-18%] w-[600px] h-[600px] opacity-20 blur-3xl"
          viewBox="0 0 400 400"
        >
          <defs>
            <linearGradient id="bdemo_bg1" x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="230" ry="160" fill="url(#bdemo_bg1)" />
        </svg>

        <svg
          className="absolute right-[-12%] bottom-[-10%] w-[560px] h-[560px] opacity-30 blur-2xl"
          viewBox="0 0 400 400"
        >
          <defs>
            <linearGradient id="bdemo_bg2" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="400" rx="130" fill="url(#bdemo_bg2)" />
        </svg>
      </div>

      {/* Page Container */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div ref={addToRef} className="reveal opacity-0 translate-y-6">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
              See StaffHub in <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500">
                Action — Book a Demo
              </span>
            </h1>

            <p className="mt-6 text-xl text-slate-600 max-w-lg leading-relaxed">
              Experience how StaffHub automates attendance, payroll, scheduling, and staff workflow  
              — fully tailored for colleges & institutions.
            </p>

            {/* Highlight Badges */}
            <div className="mt-8 flex flex-col gap-4">
              <span className="inline-flex items-center gap-3 text-teal-700 font-medium text-lg">
                <Calendar className="w-5 h-5 text-teal-700" />
                Live 1-on-1 walkthrough
              </span>

              <span className="inline-flex items-center gap-3 text-teal-700 font-medium text-lg">
                <Users className="w-5 h-5 text-teal-700" />
                Tailored for educational institutions
              </span>

              <span className="inline-flex items-center gap-3 text-teal-700 font-medium text-lg">
                <Building2 className="w-5 h-5 text-teal-700" />
                Admin + staff automation preview
              </span>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div ref={addToRef} className="reveal opacity-0 translate-y-6">
            <div className="backdrop-blur-xl bg-white/80 border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-10 relative card-anim">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Book your personalized demo
              </h2>

              <form className="flex flex-col gap-5">
                {/* Name */}
                <Field label="Full Name" type="text" icon={Users} />

                {/* Email */}
                <Field label="Email Address" type="email" icon={Mail} />

                {/* Phone */}
                <Field label="Phone Number" type="tel" icon={Phone} />

                {/* Organization */}
                <Field label="Institution / Organization" type="text" icon={Building2} />

                {/* Staff Count */}
                <Field label="Number of Staff" type="number" icon={Users} />

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-slate-700">Message / Requirements (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <textarea
                      className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 min-h-[110px] focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-lg shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Book Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .reveal {
          transition: opacity .7s ease, transform .7s ease;
        }
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .card-anim {
          animation: cardFloat 6s ease-in-out infinite;
        }
        @keyframes cardFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* Form Field Component */
function Field({ label, type, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
        <input
          type={type}
          className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          placeholder={label}
        />
      </div>
    </div>
  );
}
