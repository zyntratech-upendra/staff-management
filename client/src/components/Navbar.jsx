// Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Navbar.jsx — flush-left / flush-right layout
 * - Nav links right-aligned on desktop
 * - Full-width header with small horizontal padding to avoid large edge gaps
 * - Responsive mobile menu and polished profile dropdown
 *
 * Requirements: Tailwind CSS + react-router
 */
export default function Navbar({
  user = { name: "User Name", role: "admin" },
  onLogout = () => {},
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // Active if exact or prefix (keeps parent active for nested routes)
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  const handleNavClick = () => setMobileOpen(false);

  return (
    <header className="w-full bg-teal-600 text-white shadow-md">
      {/* Full width container; small horizontal padding reduces wasted gaps */}
      <div className="w-full px-3 sm:px-4 lg:px-6">
        {/* Use a constrained inner row but let it span the page width */}
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* LEFT: Brand (flush-left with small padding) */}
          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              to={`/${user.role}`}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-teal-200 rounded"
            >
              <div
                className="flex items-center justify-center rounded-lg shadow-sm"
                style={{ width: 48, height: 48, backgroundColor: "rgba(13,148,136,0.98)" }}
                aria-hidden
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 12l4-4 4 4 6-6 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="leading-tight">
                <div className="text-base lg:text-xl font-semibold tracking-tight select-none">Staff Management</div>
                <div className="text-xs lg:text-sm text-teal-100/90 hidden sm:block">Simple • Fast • Unified</div>
              </div>
            </Link>
          </div>

          {/* RIGHT: NavLinks + Profile + Mobile toggle */}
          {/* Use a flex container that stays as compact group on the right */}
          <div className="flex items-center gap-2 lg:gap-4">

            {/* Desktop Navlinks (right side). Hidden on mobile */}
            <nav aria-label="Primary" className="hidden md:flex items-center gap-1 lg:gap-2">
              <NavLink to={`/${user.role}`} label="Dashboard" active={isActive(`/${user.role}`)} onClick={handleNavClick} />
              <NavLink to={`/${user.role}/staff`} label="Staff" active={isActive(`/${user.role}/staff`)} onClick={handleNavClick} />
              <NavLink to={`/${user.role}/attendance`} label="Attendance" active={isActive(`/${user.role}/attendance`)} onClick={handleNavClick} />
              <NavLink to={`/${user.role}/payroll`} label="Payroll" active={isActive(`/${user.role}/payroll`)} onClick={handleNavClick} />
            </nav>

            {/* Profile capsule */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-teal-200"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                type="button"
              >
                <Avatar name={user.name} size={36} />
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-sm lg:text-base font-medium truncate" style={{ maxWidth: 140 }}>{user.name}</div>
                  <div className="text-xs lg:text-sm text-teal-100/80">{user.role}</div>
                </div>

                <svg
                  className={`w-4 h-4 ml-0 transform transition-transform ${profileOpen ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path d="M5 8l5 5 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Profile dropdown - aligned to the right edge of the button */}
              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Profile options"
                  className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50 transform origin-top-right animate-fade-in"
                  style={{ animationDuration: "160ms" }}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: "rgba(13,148,136,0.98)" }} />
                      <div>
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.role}</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link to={`/${user.role}/profile`} className="block px-4 py-2 text-sm hover:bg-slate-50 transition" onClick={() => setProfileOpen(false)}>Profile</Link>
                    <Link to={`/${user.role}/settings`} className="block px-4 py-2 text-sm hover:bg-slate-50 transition" onClick={() => setProfileOpen(false)}>Settings</Link>
                    <Link to={`/${user.role}/help`} className="block px-4 py-2 text-sm hover:bg-slate-50 transition" onClick={() => setProfileOpen(false)}>Help</Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button onClick={() => { setProfileOpen(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-50 transition" type="button">Logout</button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle (visible on small screens) */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="inline-flex items-center justify-center p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-200"
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                type="button"
              >
                <span className="sr-only">Open main menu</span>
                {mobileOpen ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Slide-down menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-teal-600/95 border-t border-teal-700 overflow-hidden transition-[max-height,opacity] duration-200 ${mobileOpen ? "max-h-[520px] py-3 opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-3 sm:px-4 space-y-2">
          <MobileLink to={`/${user.role}`} label="Dashboard" onClick={handleNavClick} />
          <MobileLink to={`/${user.role}/staff`} label="Staff" onClick={handleNavClick} />
          <MobileLink to={`/${user.role}/attendance`} label="Attendance" onClick={handleNavClick} />
          <MobileLink to={`/${user.role}/payroll`} label="Payroll" onClick={handleNavClick} />

          <div className="pt-2 border-t border-teal-700/60">
            <Link to={`/${user.role}/profile`} className="block px-3 py-3 rounded-md text-sm text-white hover:bg-teal-700/80" onClick={() => { setMobileOpen(false); }}>View Profile</Link>

            <button onClick={() => { setMobileOpen(false); onLogout(); }} className="w-full text-left px-3 py-3 rounded-md text-sm text-white hover:bg-teal-700/80" type="button">Logout</button>
          </div>
        </div>
      </div>

      {/* small keyframe animation for dropdown */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation-name: fadeIn; animation-timing-function: cubic-bezier(.2,.8,.2,1); animation-fill-mode: both; }
      `}</style>
    </header>
  );
}

/* -------- Helper subcomponents -------- */

function NavLink({ to, label, active, onClick = () => {} }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm lg:text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-200 ${ active ? "bg-teal-700/90 text-white" : "text-white/95 hover:bg-teal-700/60" }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick = () => {} }) {
  return (
    <Link to={to} onClick={onClick} className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-teal-700/80 transition">
      {label}
    </Link>
  );
}

function Avatar({ name = "User", size = 36 }) {
  const initials = (name || "U").split(" ").map((s) => s[0] || "").slice(0, 2).join("").toUpperCase();
  const bgColor = "rgba(13,148,136,0.98)";

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "9999px",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: "white", fontWeight: 700, fontSize: size > 36 ? 15 : 13 }}>{initials}</span>
    </div>
  );
}
