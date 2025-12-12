// src/pages/StaffList.jsx
import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar"; // adjust path if needed
import { Link } from "react-router-dom";

/**
 * StaffList.jsx
 * - Responsive staff directory
 * - Desktop: table with columns
 * - Mobile: card list
 * - Client-side search, filter, pagination
 *
 * Drop into your project and wire up real services later.
 */

const MOCK_STAFF = Array.from({ length: 37 }).map((_, i) => {
  const id = 1000 + i;
  const departments = ["Computer Science", "Mathematics", "Physics", "Administration", "Humanities"];
  const roles = ["Lecturer", "Assistant", "Clerk", "Associate Professor", "Professor"];
  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return {
    id,
    name: `Staff ${i + 1}`,
    email: `staff${i + 1}@ssrcollege.edu`,
    role: rnd(roles),
    department: rnd(departments),
    status: Math.random() > 0.08 ? "Active" : "On Leave",
    joined: `20${11 + (i % 10)}-${(i % 12) + 1}-10`,
  };
});

export default function StaffList({ user, onLogout }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const departments = useMemo(() => ["All", ...Array.from(new Set(MOCK_STAFF.map((s) => s.department)))], []);

  // filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = MOCK_STAFF;
    if (department !== "All") arr = arr.filter((s) => s.department === department);
    if (q) arr = arr.filter((s) => `${s.name} ${s.email} ${s.role}`.toLowerCase().includes(q));
    return arr;
  }, [query, department]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  function goToPage(p) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  function handleDelete(id) {
    if (confirm("Delete staff member? (demo)")) {
      // connect to API to delete; here we'll just log
      alert(`Deleted (demo): ${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="w-full px-3 sm:px-4 lg:px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Staff Directory</h1>
              <p className="text-sm text-slate-500 mt-1">Browse and manage staff records</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search by name, email or role..."
                  className="w-56 md:w-72 text-sm placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => { setQuery(""); setPage(1); }}
                  className="text-sm px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
                >
                  Clear
                </button>
              </div>

              <select
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                className="text-sm rounded border px-3 py-1 bg-white"
              >
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="text-sm rounded border px-3 py-1 bg-white"
              >
                {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
          </div>

          <section className="mt-6">
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Department</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pageData.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                            {s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">{s.role}</td>
                      <td className="px-4 py-3">{s.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${s.status==="Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {s.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link to={`/${user?.role}/staff/${s.id}`} className="text-indigo-600 hover:underline text-sm">View</Link>
                          <button onClick={() => alert("Edit demo")} className="text-sm text-slate-600 hover:text-indigo-600">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-sm text-rose-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {pageData.map((s) => (
                <div key={s.id} className="bg-white rounded-lg shadow-sm p-3 border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                      <div>
                        <div className="font-medium text-slate-800">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.role} • {s.department}</div>
                        <div className="text-xs text-slate-500 mt-1">Joined: {s.joined}</div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${s.status==="Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
                      <div className="flex items-center gap-2">
                        <Link to={`/${user?.role}/staff/${s.id}`} className="text-indigo-600 text-sm">View</Link>
                        <button onClick={() => handleDelete(s.id)} className="text-rose-600 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <div>Showing <span className="font-medium text-slate-800">{(page-1)*pageSize + 1}</span> - <span className="font-medium text-slate-800">{Math.min(page*pageSize, total)}</span> of <span className="font-medium text-slate-800">{total}</span></div>
            <div className="flex items-center gap-2">
              <button onClick={() => goToPage(1)} disabled={page===1} className="px-2 py-1 rounded border bg-white disabled:opacity-50">First</button>
              <button onClick={() => goToPage(page-1)} disabled={page===1} className="px-2 py-1 rounded border bg-white disabled:opacity-50">Prev</button>
              <div className="px-2">Page</div>
              <input type="number" value={page} onChange={(e)=>goToPage(Number(e.target.value||1))} className="w-14 text-center rounded border px-2 py-1 bg-white" />
              <div className="px-1">/ {totalPages}</div>
              <button onClick={() => goToPage(page+1)} disabled={page===totalPages} className="px-2 py-1 rounded border bg-white disabled:opacity-50">Next</button>
              <button onClick={() => goToPage(totalPages)} disabled={page===totalPages} className="px-2 py-1 rounded border bg-white disabled:opacity-50">Last</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
