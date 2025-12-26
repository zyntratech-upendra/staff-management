// src/pages/company/CompanyDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ClipboardList,
  Wallet,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { companyAPI, salaryAPI } from "../../services/api";

/**
 * CompanyDashboard
 * Layout & design aligned with AdminDashboard:
 * - No sidebar
 * - Top hero header with stats
 * - Tab buttons below header
 * - Cards + tables for content
 */

export default function CompanyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("employees");

  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    salaryStructure: {
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      grossSalary: 0,
    },
  });

  const [supervisorForm, setSupervisorForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [salaryForm, setSalaryForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalWorkingDays: 26,
  });

  // Attach styles once (similar to AdminDashboard look)
  useEffect(() => {
    const id = "company-dashboard-styles-no-sidebar";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      :root {
        --sh-bg: #f5fafc;
        --sh-bg-soft: #f0f7fb;
        --sh-surface: #ffffff;
        --sh-border-subtle: #e2edf4;
        --sh-text-main: #0f172a;
        --sh-text-soft: #6b7280;
        --sh-primary: #06b6d4;
        --sh-primary-deep: #0891b2;
        --sh-accent-green: #10b981;
        --sh-danger: #ef4444;
        --sh-radius-lg: 24px;
        --sh-radius-md: 16px;
        --sh-radius-pill: 999px;
        --sh-shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
        --sh-shadow-subtle: 0 10px 30px rgba(15, 23, 42, 0.05);
      }

      .company-root {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 0, #e0f7fb 0, #f9fdff 32%, #f5fafc 60%);
      }

      .company-shell {
        max-width: 1180px;
        margin: 90px auto 40px;
        padding: 0 1.5rem 3rem;
        width: 100%;
      }

      .company-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.2fr);
        gap: 1.4rem;
        margin-bottom: 1.7rem;
      }
      @media (max-width: 900px) {
        .company-hero {
          grid-template-columns: minmax(0, 1fr);
        }
        .company-shell {
          margin-top: 82px;
        }
      }

      .hero-main-card {
        border-radius: 26px;
        background: linear-gradient(135deg, #0f172a, #020617);
        color: #e5faff;
        padding: 1.2rem 1.4rem 1.3rem;
        box-shadow: 0 28px 60px rgba(15,23,42,0.55);
        position: relative;
        overflow: hidden;
      }
      .hero-main-card::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 0 0, rgba(56,189,248,0.22), transparent 55%),
                    radial-gradient(circle at 100% 100%, rgba(45,212,191,0.22), transparent 60%);
        opacity: 0.7;
        pointer-events: none;
      }
      .hero-main-inner {
        position: relative;
        z-index: 1;
      }
      .hero-title {
        font-size: 1.65rem;
        letter-spacing: -0.03em;
        margin-bottom: 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }
      .hero-subtitle {
        margin: 0;
        font-size: 0.9rem;
        color: #bfdbfe;
      }

      .hero-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.8rem;
        margin-bottom: 0.9rem;
      }
      .hero-chip {
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.7);
        padding: 0.26rem 0.7rem;
        font-size: 0.78rem;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        background: rgba(15,23,42,0.7);
      }

      .hero-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
        margin-top: 0.6rem;
      }
      .hero-footer-left {
        font-size: 0.78rem;
        color: #cbd5f5;
      }
      .hero-footer-right {
        display: flex;
        gap: 0.5rem;
      }

      .sh-btn-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.42rem 0.95rem;
        font-size: 0.8rem;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.32rem;
        white-space: nowrap;
        transition: all 0.18s ease;
      }
      .sh-btn-primary {
        background: linear-gradient(135deg, var(--sh-primary), var(--sh-primary-deep));
        color: #ffffff;
        box-shadow: 0 10px 24px rgba(8,145,178,0.3);
      }
      .sh-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 32px rgba(8,145,178,0.55);
      }
      .sh-btn-outline-light {
        background: rgba(15,23,42,0.7);
        border-color: rgba(148,163,184,0.7);
        color: #e5f3ff;
      }
      .sh-btn-outline-light:hover {
        background: rgba(15,23,42,1);
      }

      .hero-pulse-pill {
        border-radius: 999px;
        padding: 0.25rem 0.7rem;
        background: rgba(22, 163, 74, 0.16);
        border: 1px solid rgba(34,197,94,0.45);
        font-size: 0.78rem;
        color: #bbf7d0;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }
      .hero-dot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow: 0 0 0 4px rgba(34,197,94,0.4);
      }

      .hero-stats-card {
        border-radius: 24px;
        background: #ffffff;
        border: 1px solid rgba(226,237,244,0.95);
        box-shadow: var(--sh-shadow-subtle);
        padding: 1rem 1.05rem 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }
      .hero-stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .hero-stats-title {
        font-size: 0.92rem;
        font-weight: 600;
        color: var(--sh-text-main);
      }
      .hero-stats-subtitle {
        font-size: 0.75rem;
        color: var(--sh-text-soft);
      }
      .hero-pill {
        border-radius: 999px;
        padding: 0.25rem 0.7rem;
        background: var(--sh-bg-soft);
        font-size: 0.75rem;
        color: var(--sh-text-soft);
      }
      .hero-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.6rem;
      }
      .hero-stat {
        background: #f9fafb;
        border-radius: 16px;
        padding: 0.5rem 0.55rem;
      }
      .hero-stat-label {
        font-size: 0.75rem;
        color: var(--sh-text-soft);
        margin-bottom: 0.18rem;
      }
      .hero-stat-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--sh-text-main);
      }

      /* TABS like AdminDashboard */
      .company-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 1rem;
      }
      .company-tab-btn {
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        border: 1px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.82rem;
        cursor: pointer;
        color: var(--sh-text-soft);
        background: transparent;
        transition: all 0.18s ease;
      }
      .company-tab-btn svg {
        width: 16px;
        height: 16px;
      }
      .company-tab-btn:hover {
        background: var(--sh-bg-soft);
        color: var(--sh-text-main);
      }
      .company-tab-btn.active {
        background: #ffffff;
        border-color: rgba(148,163,184,0.6);
        color: var(--sh-text-main);
        box-shadow: 0 10px 26px rgba(15,23,42,0.17);
      }

      /* Card & table */
      .sh-card {
        border-radius: var(--sh-radius-lg);
        background: #ffffff;
        border: 1px solid rgba(226,237,244,0.9);
        box-shadow: var(--sh-shadow-subtle);
        padding: 1.1rem 1.15rem 1.25rem;
        margin-bottom: 1.1rem;
      }
      .sh-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.85rem;
      }
      .sh-card-title {
        font-size: 1.02rem;
        font-weight: 600;
        color: var(--sh-text-main);
        margin: 0;
      }

      .sh-table-shell {
        width: 100%;
        overflow-x: auto;
      }
      .sh-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.82rem;
        min-width: 640px;
      }
      .sh-table thead {
        background: var(--sh-bg-soft);
      }
      .sh-table th,
      .sh-table td {
        padding: 0.6rem 0.65rem;
        text-align: left;
      }
      .sh-table th {
        font-weight: 600;
        font-size: 0.78rem;
        color: var(--sh-text-soft);
        border-bottom: 1px solid var(--sh-border-subtle);
      }
      .sh-table tbody tr:nth-child(even) {
        background: #f9fafb;
      }
      .sh-table tbody tr:hover {
        background: #eef7fb;
      }

      .sh-badge {
        border-radius: var(--sh-radius-pill);
        padding: 0.22rem 0.7rem;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .sh-badge-success {
        background: #ecfdf5;
        color: #15803d;
      }
      .sh-badge-danger {
        background: #fef2f2;
        color: #b91c1c;
      }
      .sh-badge-warning {
        background: #fef3c7;
        color: #92400e;
      }

      .company-alert {
        padding: 0.55rem 0.9rem;
        border-radius: 999px;
        background: #ecfdf5;
        color: #166534;
        border: 1px solid #bbf7d0;
        font-size: 0.8rem;
        display: inline-flex;
        align-items: center;
        margin-bottom: 0.8rem;
      }

      /* Modals */
      .sh-modal-layer {
        position: fixed;
        inset: 0;
        background: rgba(15,23,42,0.26);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 60;
        padding: 1.2rem;
      }
      .sh-modal-card {
        background: #ffffff;
        border-radius: 26px;
        border: 1px solid rgba(226,237,244,0.9);
        box-shadow: 0 28px 60px rgba(15,23,42,0.32);
        width: 100%;
        max-width: 560px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .sh-modal-header {
        padding: 1rem 1.4rem 0.7rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--sh-border-subtle);
      }
      .sh-modal-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--sh-text-main);
      }
      .sh-icon-btn {
        border-radius: 999px;
        width: 28px;
        height: 28px;
        border: none;
        cursor: pointer;
        background: #f9fafb;
        font-size: 1.1rem;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sh-icon-btn:hover {
        background: #e5eff8;
      }
      .sh-modal-body {
        padding: 1rem 1.4rem 1.4rem;
        overflow-y: auto;
      }

      .sh-form-group {
        margin-bottom: 0.75rem;
      }
      .sh-form-group label {
        display: block;
        font-size: 0.8rem;
        color: var(--sh-text-soft);
        margin-bottom: 0.25rem;
      }
      .sh-input,
      .sh-select {
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
        padding: 0.45rem 0.6rem;
        font-size: 0.85rem;
        outline: none;
        transition: border-color 0.16s ease, box-shadow 0.16s ease;
      }
      .sh-input:focus,
      .sh-select:focus {
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 1px rgba(6,182,212,0.2);
      }
      .sh-form-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      @media (max-width: 720px) {
        .hero-main-card {
          padding: 1rem 1rem 1.1rem;
        }
        .sh-card {
          padding: 1rem;
        }
        .sh-table {
          min-width: 520px;
        }
        .sh-form-row {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  /* LOAD DATA */
  useEffect(() => {
    loadEmployees();
    loadSupervisors();
    loadAttendance();
    loadSalaries();
  }, []);

  const loadEmployees = async () => {
    const res = await companyAPI.getEmployees();
    setEmployees(res.data);
  };

  const loadSupervisors = async () => {
    const res = await companyAPI.getSupervisors();
    setSupervisors(res.data);
  };

  const loadAttendance = async () => {
    const res = await companyAPI.getAttendance();
    setAttendance(res.data);
  };

  const loadSalaries = async () => {
    const res = await salaryAPI.getAllSalaries();
    setSalaries(res.data);
  };

  /* ACTIONS */
  const handlePromote = async (id) => {
    if (!window.confirm("Promote this employee?")) return;
    setLoading(true);
    try {
      await companyAPI.promoteEmployee(id);
      setMessage("Employee promoted successfully");
      loadEmployees();
      loadSupervisors();
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = { ...employeeForm };
    form.salaryStructure.grossSalary =
      Number(form.salaryStructure.basicSalary) +
      Number(form.salaryStructure.hra) +
      Number(form.salaryStructure.allowances);

    await companyAPI.registerEmployee(form);
    setMessage("Employee added successfully");
    setShowModal(false);
    loadEmployees();
    setLoading(false);
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    await companyAPI.registerSupervisor(supervisorForm);
    setMessage("Supervisor added successfully");
    setShowModal(false);
    loadSupervisors();
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    await salaryAPI.generateSalary(salaryForm);
    setMessage("Salary generated successfully");
    setShowModal(false);
    loadSalaries();
  };

  const tabs = [
    { key: "employees", label: "Employees", icon: Users },
    { key: "supervisors", label: "Supervisors", icon: UserPlus },
    { key: "attendance", label: "Attendance", icon: ClipboardList },
    { key: "salary", label: "Salary", icon: Wallet },
  ];

  const totalEmployees = employees.length;
  const totalSupervisors = supervisors.length;
  const totalSalaryGenerated = salaries.length;
  const presentToday = attendance.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString() && a.status === "Present"
  ).length;

  return (
    <div className="company-root">
      <Navbar user={user} onLogout={onLogout} />

      <div className="company-shell">
        {/* HERO SECTION LIKE ADMINDASHBOARD */}
        <section className="company-hero">
          {/* Left hero */}
          <div className="hero-main-card">
            <div className="hero-main-inner">
              <div className="hero-pulse-pill">
                <span className="hero-dot" />
                Live workforce overview
              </div>

              <h1 className="hero-title">
                Company Dashboard
              </h1>
              <p className="hero-subtitle">
                Monitor staff, attendance and salary operations in real-time.
              </p>

              <div className="hero-chips">
                <span className="hero-chip">
                  <Users size={14} />
                  {totalEmployees} employees
                </span>
                <span className="hero-chip">
                  <UserPlus size={14} />
                  {totalSupervisors} supervisors
                </span>
                <span className="hero-chip">
                  <ClipboardList size={14} />
                  {presentToday} present today
                </span>
              </div>

              <div className="hero-footer">
                <div className="hero-footer-left">
                  Track onboarding, shifts and payroll without leaving this page.
                </div>
                <div className="hero-footer-right">
                  <button
                    type="button"
                    className="sh-btn-pill sh-btn-primary"
                    onClick={() => openModal("employee")}
                  >
                    <Users size={14} />
                    Add employee
                  </button>
                  <button
                    type="button"
                    className="sh-btn-pill sh-btn-outline-light"
                    onClick={() => openModal("salary")}
                  >
                    <Wallet size={14} />
                    Generate salary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right stats card */}
          <aside className="hero-stats-card">
            <div className="hero-stats-header">
              <div>
                <div className="hero-stats-title">Today&apos;s summary</div>
                <div className="hero-stats-subtitle">
                  Quick snapshot of your workforce.
                </div>
              </div>
              <span className="hero-pill">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="hero-stats-grid">
              <div className="hero-stat">
                <div className="hero-stat-label">Total employees</div>
                <div className="hero-stat-value">{totalEmployees}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-label">Supervisors</div>
                <div className="hero-stat-value">{totalSupervisors}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-label">Present today</div>
                <div className="hero-stat-value">{presentToday}</div>
              </div>
            </div>

            <div className="hero-stats-grid">
              <div className="hero-stat">
                <div className="hero-stat-label">Salary records</div>
                <div className="hero-stat-value">{totalSalaryGenerated}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-label">Status</div>
                <div className="hero-stat-value" style={{ color: "#16a34a" }}>
                  Stable
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-label">Active view</div>
                <div className="hero-stat-value">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* SUCCESS / INFO MESSAGE */}
        {message && <div className="company-alert">{message}</div>}

        {/* TABS LIKE ADMINDASHBOARD */}
        <div className="company-tabs">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={
                "company-tab-btn " + (activeTab === key ? "active" : "")
              }
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "employees" && (
          <EmployeesTab
            employees={employees}
            onAdd={() => openModal("employee")}
            onPromote={handlePromote}
            loading={loading}
          />
        )}

        {activeTab === "supervisors" && (
          <SupervisorsTab
            supervisors={supervisors}
            onAdd={() => openModal("supervisor")}
          />
        )}

        {activeTab === "attendance" && (
          <AttendanceTab attendance={attendance} />
        )}

        {activeTab === "salary" && (
          <SalaryTab
            salaries={salaries}
            onAdd={() => openModal("salary")}
          />
        )}
      </div>

      {/* MODALS */}
      {showModal && modalType === "employee" && (
        <EmployeeModal
          onClose={() => setShowModal(false)}
          employeeForm={employeeForm}
          setEmployeeForm={setEmployeeForm}
          onSubmit={handleEmployeeSubmit}
          loading={loading}
        />
      )}

      {showModal && modalType === "supervisor" && (
        <SupervisorModal
          onClose={() => setShowModal(false)}
          supervisorForm={supervisorForm}
          setSupervisorForm={setSupervisorForm}
          onSubmit={handleSupervisorSubmit}
          loading={loading}
        />
      )}

      {showModal && modalType === "salary" && (
        <SalaryModal
          onClose={() => setShowModal(false)}
          salaryForm={salaryForm}
          setSalaryForm={setSalaryForm}
          employees={employees}
          onSubmit={handleGenerateSalary}
          loading={loading}
        />
      )}
    </div>
  );
}

/* ============================= TAB COMPONENTS ============================= */

function EmployeesTab({ employees, onAdd }) {
  return (
    <ShCard title="Employees" buttonLabel="Add Employee" onAdd={onAdd}>
      <ShTable
        headers={[
          "Name",
          "Email",
          "Phone",
          "Daily Salary",
          "Start Date",
          "End Date",
        ]}
      >
        {employees.map((e) => (
          <tr key={e._id}>
            <td>{e.name}</td>
            <td>{e.email}</td>
            <td>{e.phone}</td>
            <td>₹{e.dailySalary}</td>
            <td>{new Date(e.startDate).toLocaleDateString()}</td>
            <td>
              {e.endDate ? new Date(e.endDate).toLocaleDateString() : "-"}
            </td>
          </tr>
        ))}
      </ShTable>
    </ShCard>
  );
}

function SupervisorsTab({ supervisors, onAdd }) {
  return (
    <ShCard title="Supervisors" buttonLabel="Add Supervisor" onAdd={onAdd}>
      <ShTable headers={["Name", "Email", "Phone", "Status"]}>
        {supervisors.map((s) => (
          <tr key={s._id}>
            <td>{s.name}</td>
            <td>{s.email}</td>
            <td>{s.phone}</td>
            <td>
              <ShBadge type={s.isActive ? "success" : "danger"}>
                {s.isActive ? "Active" : "Inactive"}
              </ShBadge>
            </td>
          </tr>
        ))}
      </ShTable>
    </ShCard>
  );
}

function AttendanceTab({ attendance }) {
  return (
    <ShCard title="Attendance Records">
      <ShTable
        headers={["Employee", "Date", "Status", "Supervisor", "Remarks"]}
      >
        {attendance.map((att) => (
          <tr key={att._id}>
            <td>{att.employeeId?.name}</td>
            <td>{new Date(att.date).toLocaleDateString()}</td>
            <td>
              <ShBadge
                type={
                  att.status === "Present"
                    ? "success"
                    : att.status === "Absent"
                    ? "danger"
                    : "warning"
                }
              >
                {att.status}
              </ShBadge>
            </td>
            <td>{att.supervisorId?.name}</td>
            <td>{att.remarks || "-"}</td>
          </tr>
        ))}
      </ShTable>
    </ShCard>
  );
}

function SalaryTab({ salaries, onAdd }) {
  return (
    <ShCard title="Salary Records" buttonLabel="Generate Salary" onAdd={onAdd}>
      <ShTable
        headers={[
          "Employee",
          "Month/Year",
          "Days Worked",
          "Gross",
          "Net",
          "Status",
        ]}
      >
        {salaries.map((sal) => (
          <tr key={sal._id}>
            <td>{sal.employeeId?.name}</td>
            <td>
              {sal.month}/{sal.year}
            </td>
            <td>{sal.daysWorked}</td>
            <td>₹{sal.grossSalary}</td>
            <td>₹{sal.netSalary.toFixed(2)}</td>
            <td>
              <ShBadge
                type={sal.status === "generated" ? "success" : "warning"}
              >
                {sal.status}
              </ShBadge>
            </td>
          </tr>
        ))}
      </ShTable>
    </ShCard>
  );
}

/* ========================= REUSABLE COMPONENTS ========================= */

function ShCard({ title, buttonLabel, onAdd, children }) {
  return (
    <section className="sh-card">
      <div className="sh-card-header">
        <h3 className="sh-card-title">{title}</h3>
        {buttonLabel && (
          <button
            type="button"
            className="sh-btn-pill sh-btn-primary"
            onClick={onAdd}
          >
            {buttonLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ShTable({ headers, children }) {
  return (
    <div className="sh-table-shell">
      <table className="sh-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function ShBadge({ children, type }) {
  const cls =
    type === "success"
      ? "sh-badge sh-badge-success"
      : type === "danger"
      ? "sh-badge sh-badge-danger"
      : "sh-badge sh-badge-warning";
  return <span className={cls}>{children}</span>;
}

/* =============================== MODALS =============================== */

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="sh-modal-layer">
      <div className="sh-modal-card">
        <div className="sh-modal-header">
          <h3>{title}</h3>
          <button
            className="sh-icon-btn"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="sh-modal-body">{children}</div>
      </div>
    </div>
  );
}

function EmployeeModal({
  onClose,
  employeeForm,
  setEmployeeForm,
  onSubmit,
  loading,
}) {
  return (
    <ModalWrapper title="Add Employee" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <ShInput
          label="Name"
          value={employeeForm.name}
          onChange={(e) =>
            setEmployeeForm({ ...employeeForm, name: e.target.value })
          }
        />
        <ShInput
          label="Email"
          value={employeeForm.email}
          onChange={(e) =>
            setEmployeeForm({ ...employeeForm, email: e.target.value })
          }
        />
        <ShInput
          label="Password"
          type="password"
          value={employeeForm.password}
          onChange={(e) =>
            setEmployeeForm({ ...employeeForm, password: e.target.value })
          }
        />
        <ShInput
          label="Phone"
          value={employeeForm.phone}
          onChange={(e) =>
            setEmployeeForm({ ...employeeForm, phone: e.target.value })
          }
        />

        <div className="sh-form-row">
          <ShInput
            label="Basic Salary"
            type="number"
            value={employeeForm.salaryStructure.basicSalary}
            onChange={(e) =>
              setEmployeeForm({
                ...employeeForm,
                salaryStructure: {
                  ...employeeForm.salaryStructure,
                  basicSalary: e.target.value,
                },
              })
            }
          />
          <ShInput
            label="HRA"
            type="number"
            value={employeeForm.salaryStructure.hra}
            onChange={(e) =>
              setEmployeeForm({
                ...employeeForm,
                salaryStructure: {
                  ...employeeForm.salaryStructure,
                  hra: e.target.value,
                },
              })
            }
          />
        </div>

        <ShInput
          label="Allowances"
          type="number"
          value={employeeForm.salaryStructure.allowances}
          onChange={(e) =>
            setEmployeeForm({
              ...employeeForm,
              salaryStructure: {
                ...employeeForm.salaryStructure,
                allowances: e.target.value,
              },
            })
          }
        />

        <button
          type="submit"
          className="sh-btn-pill sh-btn-primary sh-btn-full"
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </ModalWrapper>
  );
}

function SupervisorModal({
  onClose,
  supervisorForm,
  setSupervisorForm,
  onSubmit,
  loading,
}) {
  return (
    <ModalWrapper title="Add Supervisor" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <ShInput
          label="Name"
          value={supervisorForm.name}
          onChange={(e) =>
            setSupervisorForm({ ...supervisorForm, name: e.target.value })
          }
        />
        <ShInput
          label="Email"
          value={supervisorForm.email}
          onChange={(e) =>
            setSupervisorForm({ ...supervisorForm, email: e.target.value })
          }
        />
        <ShInput
          label="Password"
          type="password"
          value={supervisorForm.password}
          onChange={(e) =>
            setSupervisorForm({
              ...supervisorForm,
              password: e.target.value,
            })
          }
        />
        <ShInput
          label="Phone"
          value={supervisorForm.phone}
          onChange={(e) =>
            setSupervisorForm({ ...supervisorForm, phone: e.target.value })
          }
        />

        <button
          type="submit"
          className="sh-btn-pill sh-btn-primary sh-btn-full"
        >
          {loading ? "Adding..." : "Add Supervisor"}
        </button>
      </form>
    </ModalWrapper>
  );
}

function SalaryModal({
  onClose,
  salaryForm,
  setSalaryForm,
  employees,
  onSubmit,
  loading,
}) {
  return (
    <ModalWrapper title="Generate Salary" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="sh-form-group">
          <label>Employee</label>
          <select
            className="sh-select"
            value={salaryForm.employeeId}
            onChange={(e) =>
              setSalaryForm({ ...salaryForm, employeeId: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sh-form-row">
          <ShInput
            label="Month"
            type="number"
            value={salaryForm.month}
            onChange={(e) =>
              setSalaryForm({ ...salaryForm, month: e.target.value })
            }
          />
          <ShInput
            label="Year"
            type="number"
            value={salaryForm.year}
            onChange={(e) =>
              setSalaryForm({ ...salaryForm, year: e.target.value })
            }
          />
        </div>

        <ShInput
          label="Total Working Days"
          type="number"
          value={salaryForm.totalWorkingDays}
          onChange={(e) =>
            setSalaryForm({
              ...salaryForm,
              totalWorkingDays: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="sh-btn-pill sh-btn-primary sh-btn-full"
        >
          {loading ? "Generating..." : "Generate Salary"}
        </button>
      </form>
    </ModalWrapper>
  );
}

/* INPUT */

function ShInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="sh-form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="sh-input"
      />
    </div>
  );
}
