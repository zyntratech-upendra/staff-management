// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  Users,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { authAPI } from "../services/api";

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const cardRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      cardRef.current?.classList.add("card-visible");
      infoRef.current?.classList.add("info-visible");
    }, 140);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-cyan-50 overflow-x-hidden">

      {/* LEFT SECTION */}
      <LeftInfo infoRef={infoRef} />

      {/* RIGHT LOGIN AREA */}
      <div className="flex justify-center items-center px-6 py-14 min-h-screen">
        <div
          ref={cardRef}
          className="login-card opacity-0 translate-y-8 w-full max-w-md bg-white/85 backdrop-blur-xl shadow-2xl 
                     border border-slate-200 rounded-[1.9rem] p-10 relative"
        >

          {/* NEW ICON BUBBLE INSIDE CARD */}
          <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 shadow-inner flex items-center justify-center mb-6 animate-pop">
            <LogIn className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-3">
            Welcome Back
          </h2>

          <p className="text-center text-slate-600 mb-8 text-base">
            Access your <span className="text-teal-600 font-semibold">StaffHub</span> dashboard
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 animate-shake">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* EMAIL */}
            <InputField
              Icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />

            {/* PASSWORD */} 
            <PasswordField
              showPass={showPass}
              setShowPass={setShowPass}
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <a href="/forgot-password" className="text-sm text-teal-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                    ${loading ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"}
                    transition transform hover:-translate-y-0.5 shadow-lg`}
            >
              {loading ? <span className="loader"></span> : <LogIn className="w-5 h-5" />}
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* SIGNUP LINK */}
            <p className="text-center text-slate-600 text-sm mt-4">
              Don’t have an account?
              <a href="/signup" className="text-teal-600 font-semibold hover:underline ml-1">
                Create one
              </a>
            </p>

            {/* ADDITIONAL UI ELEMENT: TRUST BADGE */}
            <div className="flex justify-center mt-5">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Secure & Encrypted Login
              </div>
            </div>

          </form>
        </div>
      </div>

      <InternalStyles />
    </div>
  );
}

/* --------------------- SUBCOMPONENTS --------------------- */

function PasswordField({ showPass, setShowPass, value, onChange }) {
  return (
    <div className="relative">
      <Lock className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
      <input
        type={showPass ? "text" : "password"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 
                   outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 transition"
      />
      <button
        type="button"
        onClick={() => setShowPass(!showPass)}
        className="absolute right-4 top-3 text-slate-400 hover:text-slate-700"
      >
        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

function InputField({ Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 
                   outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 transition"
      />
    </div>
  );
}

/* LEFT CONTENT */
function LeftInfo({ infoRef }) {
  return (
    <div
      ref={infoRef}
      className="opacity-0 translate-x-[-20px] flex flex-col justify-center px-10 lg:px-20 xl:px-28 py-14"
    >
      <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-6">
        Welcome to{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500 animate-gradient">
          StaffHub
        </span>
      </h1>

      <p className="text-lg text-slate-600 max-w-lg leading-relaxed mb-10">
        A complete workforce management platform for institutions.  
        Automate staffing, payroll, attendance & analytics — all in one place.
      </p>

      <div className="space-y-4 mb-10">
        <Feature icon={Users} text="Manage staff & departments" />
        <Feature icon={ShieldCheck} text="Secure role-based access" />
        <Feature icon={CheckCircle} text="Automated attendance & payroll" />
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-md">
        <Stat number="1,200+" label="Active Staff" />
        <Stat number="48,700" label="Monthly Logins" />
        <Stat number="4.8/5" label="User Rating" />
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 animate-pop">
      <Icon className="w-6 h-6 text-teal-600" />
      <span className="text-slate-700 text-lg">{text}</span>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="p-4 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl text-center shadow animate-pop">
      <div className="text-2xl font-bold text-slate-900">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

/* INTERNAL CSS */
function InternalStyles() {
  return (
    <style>{`
      .card-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all .7s cubic-bezier(.2,.9,.2,1);
      }
      .info-visible {
        opacity: 1 !important;
        transform: translateX(0) !important;
        transition: all .8s cubic-bezier(.2,.9,.2,1);
      }

      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      .animate-shake { animation: shake .35s; }

      .loader {
        width: 18px;
        height: 18px;
        border: 3px solid white;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin .7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      @keyframes pop {
        from { transform: scale(.94); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .animate-pop { animation: pop .55s ease both; }
    `}</style>
  );
}
