import React from "react";

// StaffManagement_UI_Starter.jsx
// Single-file React component showcasing a modern, dynamic UI for a Staff Management System.
// Uses Tailwind CSS utility classes (assumes Tailwind is configured in the project).
// Features:
// - Animated gradient header
// - Responsive sidebar with icons and collapse behavior
// - Dashboard cards with micro-interactions
// - Table/list placeholder with search and filters
// - Accessible, semantic markup

export default function StaffManagementUI() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 antialiased">
      {/* Gradient header */}
      <header className="relative bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 21c0-3.866 3.582-7 9-7s9 3.134 9 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">SSR Staff Management</h1>
                <p className="text-sm opacity-90">Manage staff, attendance, leave, payroll — all in one place</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-white/20 backdrop-blur px-3 py-1.5 rounded-full gap-2">
                <svg className="w-4 h-4 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input className="bg-transparent placeholder-white/80 focus:outline-none text-sm" placeholder="Search staff, id or department" />
              </div>

              {/* Profile */}
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">
                <img src="https://ui-avatars.com/api/?name=R+R&background=ffffff&color=111827" alt="avatar" className="w-8 h-8 rounded-full" />
                <div className="text-left">
                  <div className="text-sm font-medium">Rama Raju K</div>
                  <div className="text-xs opacity-80">Admin</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative animated wave */}
        <div className="absolute inset-x-0 -bottom-2 overflow-hidden pointer-events-none">
          <svg className="block w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0 24c120 0 240-24 360-24s240 24 360 24 240-24 360-24 240 24 360 24v24H0z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm sticky top-6 h-[calc(100vh-96px)] overflow-auto">
            <nav className="space-y-2">
              <NavItem icon={IconDashboard} label="Dashboard" active />
              <NavItem icon={IconUsers} label="Staff" />
              <NavItem icon={IconCalendar} label="Attendance" />
              <NavItem icon={IconFile} label="Payroll" />
              <NavItem icon={IconSettings} label="Settings" />
            </nav>

            <div className="mt-6 pt-4 border-t pt-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-400">Quick Actions</h3>
              <div className="flex flex-col gap-2 mt-3">
                <button className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:scale-[1.01] transition transform">+ Add Staff</button>
                <button className="text-sm px-3 py-2 rounded-lg bg-white border hover:shadow">Import CSV</button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Staff" value="1,248" delta="+4%" icon={IconUsers} />
              <StatCard title="Today Present" value="1,032" delta="-1.2%" icon={IconCalendar} />
              <StatCard title="On Leave" value="54" delta="+0.5%" icon={IconFile} />
              <StatCard title="Avg. Rating" value="4.6" delta="+0.3%" icon={IconStar} />
            </section>

            <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large card: Attendance Chart placeholder */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Attendance (Last 30 days)</h2>
                  <div className="flex items-center gap-2">
                    <select className="text-sm rounded px-2 py-1 border">
                      <option>All Departments</option>
                      <option>Computer Science</option>
                      <option>Humanities</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 h-56 rounded-md bg-gradient-to-b from-gray-50 to-white border border-dashed flex items-center justify-center text-slate-400">
                  Chart placeholder — integrate chart library (recharts / chart.js) here.
                </div>
              </div>

              {/* Staff list / quick actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold">Recent Hires</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="https://ui-avatars.com/api/?name=J+K" alt="j k" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="text-sm font-medium">Jaya Kumar</div>
                        <div className="text-xs text-slate-500">Assistant Professor</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">2d ago</div>
                  </li>

                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="https://ui-avatars.com/api/?name=A+S" alt="a s" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="text-sm font-medium">Anil Sharma</div>
                        <div className="text-xs text-slate-500">Clerk</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">5d ago</div>
                  </li>
                </ul>

                <div className="mt-4 text-center">
                  <button className="text-sm px-3 py-2 rounded-lg border">View all staff</button>
                </div>
              </div>
            </section>

            {/* Table / management area */}
            <section className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Staff Directory</h3>
                <div className="flex items-center gap-2">
                  <input placeholder="Search by name, id, role..." className="px-3 py-2 rounded border text-sm" />
                  <button className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Filter</button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Name</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Department</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=User+${i}&background=E6E7F2&color=3B4252`} alt="user" className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="font-medium">User {i + 1}</div>
                            <div className="text-xs text-slate-500">ID: S-00{i + 1}</div>
                          </div>
                        </td>
                        <td className="py-3">Lecturer</td>
                        <td className="py-3">Computer Science</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Active</span></td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 rounded border text-xs">Edit</button>
                            <button className="px-2 py-1 rounded border text-xs">More</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="mt-6 text-sm text-slate-500 text-center">© {new Date().getFullYear()} SSR Degree College — Staff Management</footer>
          </main>
        </div>
      </div>
    </div>
  );
}


// --- Small UI helper components ---

function NavItem({ icon: Icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${active ? 'bg-indigo-50 shadow-sm' : 'hover:bg-slate-50'}`}>
      <span className="w-6 h-6 flex items-center justify-center opacity-90"><Icon /></span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, delta, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center shadow-inner">
        <Icon />
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
      </div>
      <div className={`text-sm font-medium ${delta && delta.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{delta}</div>
    </div>
  );
}

// --- Small inline icons ---
function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.28 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 4.28A2 2 0 016.04 1.45l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 0010.7 1.45L12 2" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 17.3l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2l3.08 6.75L22 9.76l-5.02 3.9 1.18 6.88z" stroke="#4B5563" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
