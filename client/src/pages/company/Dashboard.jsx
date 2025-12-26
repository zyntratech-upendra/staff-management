// src/pages/company/CompanyDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Menu,
  Users,
  UserPlus,
  ClipboardList,
  Wallet,
  X,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { companyAPI, salaryAPI } from "../../services/api";

/* ============================================================================
   TOP NAVBAR + FIXED SIDEBAR + RESPONSIVE PERFECT ADMIN LAYOUT (B2)
============================================================================ */

export default function CompanyDashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");

  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  console.log(employees)

  const [salaryForm, setSalaryForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalWorkingDays: 26,
  });

  /* ------------------------- LOAD DATA -------------------------- */
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

  /* ------------------------- ACTIONS ---------------------------- */
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

  /* ------------------------- SIDEBAR MENU ------------------------ */
  const menu = [
    { key: "employees", label: "Employees", icon: Users },
    { key: "supervisors", label: "Supervisors", icon: UserPlus },
    { key: "attendance", label: "Attendance", icon: ClipboardList },
    { key: "salary", label: "Salary", icon: Wallet },
  ];

  /* ====================================================================
     PERFECT RESPONSIVE ADMIN LAYOUT (B2)
     NAVBAR FULL WIDTH, SIDEBAR FIXED LEFT, CONTENT ALIGNED
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
                onClick={() => setActiveTab(key)}
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

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {activeTab.toUpperCase()}
            </h1>

            {message && (
              <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg shadow">
                {message}
              </div>
            )}
          </div>

          {/* -------- TAB CONTENT -------- */}
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

          {activeTab === "attendance" && <AttendanceTab attendance={attendance} />}

          {activeTab === "salary" && (
            <SalaryTab salaries={salaries} onAdd={() => openModal("salary")} />
          )}
        </main>
      </div>

      {/* -------- MODALS -------- */}
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
   TAB COMPONENTS
============================================================================ */

function EmployeesTab({ employees, onAdd, onPromote, loading }) {
  return (
    <Card title="Employees">
      <Table
        headers={["Name", "Email", "Phone", "Daily Salary","Start Date","End Date"]}
      >
        {employees.map((e) => (
          <tr key={e._id} className="hover:bg-gray-50">
            <td className="py-2">{e.name}</td>
            <td>{e.email}</td>
            <td>{e.phone}</td>
            <td>₹{e.dailySalary}</td>
            <td>{new Date(e.startDate).toLocaleDateString()}</td>
            <td>{e.endDate ? new Date(e.endDate).toLocaleDateString() : "-"}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* -------------------- Supervisor Tab -------------------- */
function SupervisorsTab({ supervisors, onAdd }) {
  return (
    <Card title="Supervisors">
      <Table headers={["Name", "Email", "Phone", "Status"]}>
        {supervisors.map((s) => (
          <tr key={s._id} className="hover:bg-gray-50">
            <td className="py-2">{s.name}</td>
            <td>{s.email}</td>
            <td>{s.phone}</td>
            <td>
              <Badge type={s.isActive ? "success" : "danger"}>
                {s.isActive ? "Active" : "Inactive"}
              </Badge>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* -------------------- Attendance Tab -------------------- */
function AttendanceTab({ attendance }) {
  return (
    <Card title="Attendance Records">
      <Table headers={["Employee", "Date", "Status", "Supervisor", "Remarks"]}>
        {attendance.map((att) => (
          <tr key={att._id} className="hover:bg-gray-50">
            <td className="py-2">{att.employeeId?.name}</td>
            <td>{new Date(att.date).toLocaleDateString()}</td>
            <td>
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
            <td>{att.supervisorId?.name}</td>
            <td>{att.remarks || "-"}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* -------------------- Salary Tab -------------------- */
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
        {salaries.map((sal) => (
          <tr key={sal._id} className="hover:bg-gray-50">
            <td className="py-2">{sal.employeeId?.name}</td>
            <td>
              {sal.month}/{sal.year}
            </td>
            <td>{sal.daysWorked}</td>
            <td>₹{sal.grossSalary}</td>
            <td>₹{sal.netSalary.toFixed(2)}</td>
            <td>
              <Badge type={sal.status === "generated" ? "success" : "warning"}>
                {sal.status}
              </Badge>
            </td>
          </tr>
        ))}
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
        <h3 className="text-lg font-semibold">{title}</h3>

        {buttonLabel && (
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
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
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 border-b font-medium text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Badge({ children, type }) {
  const colors = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-sm ${colors[type]}`}>
      {children}
    </span>
  );
}

/* ============================================================================
   MODALS
============================================================================ */

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button className="text-2xl" onClick={onClose}>
            ×
          </button>
        </div>

        {children}
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
      <form onSubmit={onSubmit} className="space-y-4">

        <Input label="Name" value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} />

        <Input label="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />

        <Input label="Password" type="password" value={employeeForm.password} onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} />

        <Input label="Phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />

        <Input
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

        <Input
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

        <Input
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

        <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
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
      <form onSubmit={onSubmit} className="space-y-4">

        <Input label="Name" value={supervisorForm.name} onChange={(e) => setSupervisorForm({ ...supervisorForm, name: e.target.value })} />

        <Input label="Email" value={supervisorForm.email} onChange={(e) => setSupervisorForm({ ...supervisorForm, email: e.target.value })} />

        <Input label="Password" type="password" value={supervisorForm.password} onChange={(e) => setSupervisorForm({ ...supervisorForm, password: e.target.value })} />

        <Input label="Phone" value={supervisorForm.phone} onChange={(e) => setSupervisorForm({ ...supervisorForm, phone: e.target.value })} />

        <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
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
      <form onSubmit={onSubmit} className="space-y-4">

        <div>
          <label className="font-medium">Employee</label>
          <select
            value={salaryForm.employeeId}
            onChange={(e) =>
              setSalaryForm({ ...salaryForm, employeeId: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <Input label="Month" type="number" value={salaryForm.month} onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })} />

        <Input label="Year" type="number" value={salaryForm.year} onChange={(e) => setSalaryForm({ ...salaryForm, year: e.target.value })} />

        <Input label="Total Working Days" type="number" value={salaryForm.totalWorkingDays} onChange={(e) => setSalaryForm({ ...salaryForm, totalWorkingDays: e.target.value })} />

        <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
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
      <label className="font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border rounded-lg"
      />
    </div>
  );
}
