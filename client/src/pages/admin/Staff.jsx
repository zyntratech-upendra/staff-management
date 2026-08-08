import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Users, FileText, Briefcase, IndianRupee, ClipboardList, X } from 'lucide-react';

export default function AdminStaff({ user, onLogout }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('profile'); // profile, documents, assignments, attendance, salary

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await adminAPI.getStaffDetails();
      setStaffList(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff details');
    } finally {
      setLoading(false);
    }
  };

  const openStaffModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setActiveModalTab('profile');
  };

  const closeStaffModal = () => {
    setSelectedStaff(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="p-6 max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Staff Directory
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 animate-pulse">Loading staff details...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Role</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Phone</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staffList.map((staff) => (
                    <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        {staff.companyId && staff.companyId.name && (
                          <div className="text-xs text-gray-500 mt-1">{staff.companyId.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                          ${staff.role === 'supervisor' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}
                        `}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                      <td className="px-6 py-4 text-gray-600">{staff.phone || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openStaffModal(staff)}
                          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {staffList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No staff members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h2>
                <p className="text-gray-500 capitalize">{selectedStaff.role}</p>
              </div>
              <button 
                onClick={closeStaffModal}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Navigation */}
            <div className="flex border-b px-6 bg-white shrink-0 overflow-x-auto hide-scrollbar">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${activeModalTab === 'profile' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveModalTab('profile')}
              >
                Profile Info
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'documents' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveModalTab('documents')}
              >
                <FileText className="w-4 h-4" /> Documents
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'assignments' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveModalTab('assignments')}
              >
                <Briefcase className="w-4 h-4" /> Assignments
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'attendance' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveModalTab('attendance')}
              >
                <ClipboardList className="w-4 h-4" /> Attendance
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'salary' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveModalTab('salary')}
              >
                <IndianRupee className="w-4 h-4" /> Salary History
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto bg-white grow">
              
              {/* Profile Tab */}
              {activeModalTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      <div><span className="text-gray-500 w-24 inline-block">Email:</span> <span className="font-medium">{selectedStaff.email}</span></div>
                      <div><span className="text-gray-500 w-24 inline-block">Phone:</span> <span className="font-medium">{selectedStaff.phone || '-'}</span></div>
                      <div><span className="text-gray-500 w-24 inline-block align-top">Address:</span> <span className="font-medium inline-block w-48">{selectedStaff.address || '-'}</span></div>
                    </div>
                  </div>
                  
                  {selectedStaff.role === 'employee' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Bank Details</h3>
                      <div className="space-y-3">
                        <div><span className="text-gray-500 w-32 inline-block">Account No:</span> <span className="font-medium">{selectedStaff.bankDetails?.accountNumber || '-'}</span></div>
                        <div><span className="text-gray-500 w-32 inline-block">IFSC Code:</span> <span className="font-medium">{selectedStaff.bankDetails?.ifscCode || '-'}</span></div>
                        <div><span className="text-gray-500 w-32 inline-block">Bank Name:</span> <span className="font-medium">{selectedStaff.bankDetails?.bankName || '-'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeModalTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h3 className="font-semibold text-gray-800 mb-2">Aadhaar Card</h3>
                    <p className="text-gray-600 mb-4 text-sm">Number: <span className="font-medium">{selectedStaff.aadhaar || '-'}</span></p>
                    {selectedStaff.aadhaarPhoto ? (
                      <a href={selectedStaff.aadhaarPhoto} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <img src={selectedStaff.aadhaarPhoto} alt="Aadhaar Document" className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow" />
                      </a>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 italic">No image uploaded</div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h3 className="font-semibold text-gray-800 mb-2">PAN Card</h3>
                    <p className="text-gray-600 mb-4 text-sm">Number: <span className="font-medium">{selectedStaff.pan || '-'}</span></p>
                    {selectedStaff.panPhoto ? (
                      <a href={selectedStaff.panPhoto} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <img src={selectedStaff.panPhoto} alt="PAN Document" className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow" />
                      </a>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 italic">No image uploaded</div>
                    )}
                  </div>
                </div>
              )}

              {/* Assignments Tab */}
              {activeModalTab === 'assignments' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Assignment History</h3>
                  {selectedStaff.assignments?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedStaff.assignments.map(assignment => (
                        <div key={assignment._id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{assignment.companyId?.name || 'Unknown Company'}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                              assignment.status === 'active' ? 'bg-green-100 text-green-700' :
                              assignment.status === 'completed' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Dates:</span> {new Date(assignment.startDate).toLocaleDateString()} to {new Date(assignment.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Daily Salary:</span> ₹{assignment.dailySalary}</p>
                            {assignment.description && (
                              <p className="mt-2"><span className="font-medium block mb-1">Description:</span> <span className="text-gray-800 bg-white p-2 rounded border block">{assignment.description}</span></p>
                            )}
                            {assignment.notes && (
                              <p className="mt-2"><span className="font-medium block mb-1">Notes:</span> <span className="text-gray-800 bg-white p-2 rounded border block">{assignment.notes}</span></p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No assignments found for this staff member.</p>
                  )}
                </div>
              )}

              {/* Attendance Tab */}
              {activeModalTab === 'attendance' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Attendance</h3>
                  {selectedStaff.attendance?.length > 0 ? (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 font-medium text-gray-700 text-sm border-b">Date</th>
                            <th className="px-4 py-2 font-medium text-gray-700 text-sm border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedStaff.attendance
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(att => (
                            <tr key={att._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">{new Date(att.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  att.status?.toLowerCase().includes('present') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {att.status || 'Unknown'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No attendance records found.</p>
                  )}
                </div>
              )}

              {/* Salary Tab */}
              {activeModalTab === 'salary' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Salary History</h3>
                  {selectedStaff.salaries?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedStaff.salaries
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(sal => (
                        <div key={sal._id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50">
                          <div>
                            <p className="font-semibold text-gray-900">{sal.companyId?.name || 'Unknown Company'}</p>
                            <p className="text-sm text-gray-600">Month: {sal.month} / {sal.year}</p>
                            <p className="text-sm text-gray-500 mt-1">Status: <span className="uppercase font-medium text-yellow-600">{sal.status}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teal-600">₹{sal.netSalary}</p>
                            <p className="text-xs text-gray-500">Gross: ₹{sal.grossSalary} | Deductions: ₹{sal.deductions}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No salary records found.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
