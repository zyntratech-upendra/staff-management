// src/pages/company/CompanyDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Menu,
  Users,
  UserPlus,
  ClipboardList,
  Wallet,
  X,
  Search,
  Loader2, // Added for loading spinner
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { companyAPI, salaryAPI } from "../../services/api";

/* ============================================================================
   TOP NAVBAR + FIXED SIDEBAR + RESPONSIVE PERFECT ADMIN LAYOUT (B2)
   + OPTIMIZED FUNCTIONALITIES (Search, Parallel Fetch, Safe Math)
============================================================================ */

export default function CompanyDashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");

  // Data States
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // UI States
  const [initialLoading, setInitialLoading] = useState(true); // NEW: Global loading
  const [loading, setLoading] = useState(false); // For form submissions
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // NEW: Search state

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  /* ------------------------- FORM STATES ------------------------- */
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

  /* ------------------------- OPTIMIZED LOAD DATA -------------------------- */
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setInitialLoading(true);
    try {
      // Parallel Fetching: 4x faster than sequential
      const [empRes, supRes, attRes, salRes] = await Promise.all([
        companyAPI.getEmployees(),
        companyAPI.getSupervisors(),
        companyAPI.getAttendance(),
        salaryAPI.getAllSalaries(),
      ]);

      setEmployees(empRes.data);
      setSupervisors(supRes.data);
      setAttendance(attRes.data);
      setSalaries(salRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      setMessage("Failed to load data. Please refresh.");
    } finally {
      setInitialLoading(false);
    }
  };

  // Helper to reload individual sections after updates
  const reloadEmployees = async () => {
    const res = await companyAPI.getEmployees();
    setEmployees(res.data);
  };
  const reloadSupervisors = async () => {
    const res = await companyAPI.getSupervisors();
    setSupervisors(res.data);
  };
  const reloadSalaries = async () => {
    const res = await salaryAPI.getAllSalaries();
    setSalaries(res.data);
  };

  /* ------------------------- FILTER LOGIC ------------------------- */
  const getFilteredData = (data, fieldPath = "name") => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    
    return data.filter((item) => {
      // Handles nested properties like 'employeeId.name'
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], item);
      return String(value || "").toLowerCase().includes(lowerTerm);
    });
  };

  /* ------------------------- ACTIONS ---------------------------- */
  const handlePromote = async (id) => {
    if (!window.confirm("Promote this employee?")) return;
    setLoading(true);
    try {
      await companyAPI.promoteEmployee(id);
      setMessage("Employee promoted successfully");
      reloadEmployees();
      reloadSupervisors();
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
    // NEW: Safe Math (handles empty strings or undefined)
    const basic = Number(form.salaryStructure.basicSalary) || 0;
    const hra = Number(form.salaryStructure.hra) || 0;
    const allow = Number(form.salaryStructure.allowances) || 0;

    form.salaryStructure.grossSalary = basic + hra + allow;

    try {
      await companyAPI.registerEmployee(form);
      setMessage("Employee added successfully");
      setShowModal(false);
      reloadEmployees();
      // Reset form (optional)
      setEmployeeForm({ ...employeeForm, name: "", email: "", password: "", phone: "" });
    } catch (err) {
        console.error(err);
        setMessage("Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await companyAPI.registerSupervisor(supervisorForm);
        setMessage("Supervisor added successfully");
        setShowModal(false);
        reloadSupervisors();
    } finally {
        setLoading(false);
    }
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await salaryAPI.generateSalary(salaryForm);
        setMessage("Salary generated successfully");
        setShowModal(false);
        reloadSalaries();
    } finally {
        setLoading(false);
    }
  };

  /* ------------------------- SIDEBAR MENU ------------------------ */
  const menu = [
    { key: "employees", label: "Employees", icon: Users },
    { key: "supervisors", label: "Supervisors", icon: UserPlus },
    { key: "attendance", label: "Attendance", icon: ClipboardList },
    { key: "salary", label: "Salary", icon: Wallet },
  ];

  /* ====================================================================
      RENDER
   ==================================================================== */
  return (
    <div className="min-h-screen bg-gray-100">

      {/* -------------- TOP FULL-WIDTH NAVBAR ---------------- */}
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">

        {/* -------------------- SIDEBAR -------------------- */}
        <aside
          className={`fixed top-[82px] left-0 h-[calc(100vh-64px)] w-72 bg-white border-r shadow-md z-50
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">StaffHub</h2>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menu.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                    setActiveTab(key);
                    setSearchTerm(""); // Reset search on tab switch
                    setSidebarOpen(false); // Close mobile sidebar
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    activeTab === key
                      ? "bg-teal-600 text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* -------------------- CONTENT AREA -------------------- */}
        <main className="flex-1 lg:ml-72 px-6 py-6">

          {/* Mobile Sidebar Button */}
          <button
            className="lg:hidden mb-4 bg-white p-2 rounded-lg shadow"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          {/* Page Header + Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {activeTab.toUpperCase()}
            </h1>

            <div className="flex items-center gap-3 w-full md:w-auto">
                 {/* SEARCH BAR */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                </div>
                
                {message && (
                <div className="hidden md:block px-4 py-2 bg-teal-100 text-teal-700 rounded-lg shadow text-sm">
                    {message}
                </div>
                )}
            </div>
          </div>
          
          {/* Mobile message only */}
           {message && (
              <div className="md:hidden mb-4 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg shadow text-sm">
                  {message}
              </div>
            )}

          {/* -------- TAB CONTENT (With Loading & Filtering) -------- */}
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-teal-600" />
                <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
                {activeTab === "employees" && (
                    <EmployeesTab
                    employees={getFilteredData(employees, "name")}
                    onAdd={() => openModal("employee")}
                    onPromote={handlePromote}
                    loading={loading}
                    />
                )}

                {activeTab === "supervisors" && (
                    <SupervisorsTab
                    supervisors={getFilteredData(supervisors, "name")}
                    onAdd={() => openModal("supervisor")}
                    />
                )}

                {activeTab === "attendance" && (
                    <AttendanceTab 
                        attendance={getFilteredData(attendance, "employeeId.name")} 
                    />
                )}

                {activeTab === "salary" && (
                    <SalaryTab 
                        salaries={getFilteredData(salaries, "employeeId.name")} 
                        onAdd={() => openModal("salary")} 
                    />
                )}
            </>
          )}

        </main>
      </div>

      {/* -------- MODALS (Keep existing logic) -------- */}
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

/* ============================================================================
   TAB COMPONENTS (Unchanged, just receive filtered data now)
============================================================================ */

function EmployeesTab({ employees, onAdd, onPromote, loading }) {
  return (
    <Card title="Employees" buttonLabel="Add Employee" onAdd={onAdd}>
      <Table
        headers={["Name", "Email", "Phone", "Daily Salary","Start Date","End Date"]}
      >
        {employees.length === 0 ? (
            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No employees found.</td></tr>
        ) : (
            employees.map((e) => (
            <tr key={e._id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="py-3 px-4">{e.name}</td>
                <td className="px-4">{e.email}</td>
                <td className="px-4">{e.phone}</td>
                <td className="px-4">₹{e.dailySalary}</td>
                <td className="px-4">{new Date(e.startDate).toLocaleDateString()}</td>
                <td className="px-4">{e.endDate ? new Date(e.endDate).toLocaleDateString() : "-"}</td>
            </tr>
            ))
        )}
      </Table>
    </Card>
  );
}

function SupervisorsTab({ supervisors, onAdd }) {
  return (
    <Card title="Supervisors" buttonLabel="Add Supervisor" onAdd={onAdd}>
      <Table headers={["Name", "Email", "Phone", "Status"]}>
        {supervisors.length === 0 ? (
             <tr><td colSpan="4" className="p-4 text-center text-gray-500">No supervisors found.</td></tr>
        ) : (
            supervisors.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="py-3 px-4">{s.name}</td>
                <td className="px-4">{s.email}</td>
                <td className="px-4">{s.phone}</td>
                <td className="px-4">
                <Badge type={s.isActive ? "success" : "danger"}>
                    {s.isActive ? "Active" : "Inactive"}
                </Badge>
                </td>
            </tr>
            ))
        )}
      </Table>
    </Card>
  );
}

function AttendanceTab({ attendance }) {
  return (
    <Card title="Attendance Records">
      <Table headers={["Employee", "Date", "Status", "Supervisor", "Remarks"]}>
        {attendance.length === 0 ? (
             <tr><td colSpan="5" className="p-4 text-center text-gray-500">No attendance records found.</td></tr>
        ) : (
            attendance.map((att) => (
            <tr key={att._id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="py-3 px-4">{att.employeeId?.name || "Unknown"}</td>
                <td className="px-4">{new Date(att.date).toLocaleDateString()}</td>
                <td className="px-4">
                <Badge
                    type={
                    att.status === "Present"
                        ? "success"
                        : att.status === "Absent"
                        ? "danger"
                        : "warning"
                    }
                >
                    {att.status}
                </Badge>
                </td>
                <td className="px-4">{att.supervisorId?.name || "System"}</td>
                <td className="px-4">{att.remarks || "-"}</td>
            </tr>
            ))
        )}
      </Table>
    </Card>
  );
}

function SalaryTab({ salaries, onAdd }) {
  return (
    <Card title="Salary Records" buttonLabel="Generate Salary" onAdd={onAdd}>
      <Table
        headers={[
          "Employee",
          "Month/Year",
          "Days Worked",
          "Gross",
          "Net",
          "Status",
        ]}
      >
        {salaries.length === 0 ? (
             <tr><td colSpan="6" className="p-4 text-center text-gray-500">No salary records found.</td></tr>
        ) : (
            salaries.map((sal) => (
            <tr key={sal._id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="py-3 px-4">{sal.employeeId?.name || "Unknown"}</td>
                <td className="px-4">
                {sal.month}/{sal.year}
                </td>
                <td className="px-4">{sal.daysWorked}</td>
                <td className="px-4">₹{sal.grossSalary}</td>
                <td className="px-4">₹{sal.netSalary.toFixed(2)}</td>
                <td className="px-4">
                <Badge type={sal.status === "generated" ? "success" : "warning"}>
                    {sal.status}
                </Badge>
                </td>
            </tr>
            ))
        )}
      </Table>
    </Card>
  );
}

/* ============================================================================
   REUSABLE COMPONENTS
============================================================================ */

function Card({ title, buttonLabel, onAdd, children }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {buttonLabel && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            {buttonLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 border-b font-semibold text-xs text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
}

function Badge({ children, type }) {
  const colors = {
    success: "bg-green-100 text-green-800 border border-green-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type]}`}>
      {children}
    </span>
  );
}

/* ============================================================================
   MODALS (Unchanged logic, kept clean)
============================================================================ */

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors" 
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmployeeModal({ onClose, employeeForm, setEmployeeForm, onSubmit, loading }) {
  return (
    <ModalWrapper title="Add Employee" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} />
        <Input label="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
        <Input label="Password" type="password" value={employeeForm.password} onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} />
        <Input label="Phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />
        
        <div className="grid grid-cols-2 gap-4">
            <Input label="Basic Salary" type="number" value={employeeForm.salaryStructure.basicSalary} onChange={(e) => setEmployeeForm({ ...employeeForm, salaryStructure: { ...employeeForm.salaryStructure, basicSalary: e.target.value } })} />
            <Input label="HRA" type="number" value={employeeForm.salaryStructure.hra} onChange={(e) => setEmployeeForm({ ...employeeForm, salaryStructure: { ...employeeForm.salaryStructure, hra: e.target.value } })} />
        </div>
        <Input label="Allowances" type="number" value={employeeForm.salaryStructure.allowances} onChange={(e) => setEmployeeForm({ ...employeeForm, salaryStructure: { ...employeeForm.salaryStructure, allowances: e.target.value } })} />

        <button className="w-full py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex justify-center items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </ModalWrapper>
  );
}

function SupervisorModal({ onClose, supervisorForm, setSupervisorForm, onSubmit, loading }) {
  return (
    <ModalWrapper title="Add Supervisor" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" value={supervisorForm.name} onChange={(e) => setSupervisorForm({ ...supervisorForm, name: e.target.value })} />
        <Input label="Email" value={supervisorForm.email} onChange={(e) => setSupervisorForm({ ...supervisorForm, email: e.target.value })} />
        <Input label="Password" type="password" value={supervisorForm.password} onChange={(e) => setSupervisorForm({ ...supervisorForm, password: e.target.value })} />
        <Input label="Phone" value={supervisorForm.phone} onChange={(e) => setSupervisorForm({ ...supervisorForm, phone: e.target.value })} />

        <button className="w-full py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex justify-center items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Adding..." : "Add Supervisor"}
        </button>
      </form>
    </ModalWrapper>
  );
}

function SalaryModal({ onClose, salaryForm, setSalaryForm, employees, onSubmit, loading }) {
  return (
    <ModalWrapper title="Generate Salary" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <select
            value={salaryForm.employeeId}
            onChange={(e) => setSalaryForm({ ...salaryForm, employeeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input label="Month" type="number" value={salaryForm.month} onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })} />
            <Input label="Year" type="number" value={salaryForm.year} onChange={(e) => setSalaryForm({ ...salaryForm, year: e.target.value })} />
        </div>
        <Input label="Total Working Days" type="number" value={salaryForm.totalWorkingDays} onChange={(e) => setSalaryForm({ ...salaryForm, totalWorkingDays: e.target.value })} />

        <button className="w-full py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex justify-center items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating..." : "Generate Salary"}
        </button>
      </form>
    </ModalWrapper>
  );
}

/* -------------------- Input Component -------------------- */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
