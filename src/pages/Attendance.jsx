import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { icons } from "../components/Icons";
import { useEffect, useState } from "react";
import {
    getTodayAttendance,
    getEmployeeAttendance,
    getMonthlyAttendance,
    addAttendance,
    getEmployees
} from "../services/api";

function Attendance({ sidebarOpen, onMenuToggle }) {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filter, setFilter] = useState("TODAY");
    const [employeeHistory, setEmployeeHistory] = useState([]);
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [formData, setFormData] = useState({
        employeeId: "",
        employeeName: "",
        department: "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        status: "PRESENT"
    });

    useEffect(() => {
        loadTodayAttendance();
        loadEmployees();
    }, []);

    const loadTodayAttendance = async () => {
        try {
            const data = await getTodayAttendance();
            setAttendance(data);
        } catch (error) {
            console.error("Today's attendance error:", error);
            alert("Could not load today's attendance");
        }
    };

    const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Employees loading error:", error);
            alert("Could not load employees");
        }
    };

    const openAttendanceForm = () => {
        setFormData({
            employeeId: "",
            employeeName: "",
            department: "",
            date: new Date().toISOString().split("T")[0],
            checkIn: "",
            checkOut: "",
            status: "PRESENT"
        });
        setShowForm(true);
    };

    const handleEmployeeIdChange = (e) => {
        const employeeId = e.target.value;
        setFormData(prev => ({ ...prev, employeeId }));
        if (!employeeId) {
            setFormData(prev => ({ ...prev, employeeId: "", employeeName: "", department: "" }));
            return;
        }
        const employee = employees.find(emp => String(emp.employeeid) === String(employeeId).trim());
        if (employee) {
            setFormData(prev => ({
                ...prev,
                employeeId: employee.employeeid,
                employeeName: employee.employeName || "",
                department: employee.department || ""
            }));
        } else {
            setFormData(prev => ({ ...prev, employeeName: "", department: "" }));
        }
    };

    const handleEmployeeNameChange = (e) => {
        const employeeName = e.target.value;
        setFormData(prev => ({ ...prev, employeeName }));
        if (!employeeName.trim()) {
            setFormData(prev => ({ ...prev, employeeName: "", employeeId: "", department: "" }));
            return;
        }
        const typedName = employeeName.trim().toLowerCase();
        const employee = employees.find(emp => String(emp.employeName || "").toLowerCase() === typedName);
        if (employee) {
            setFormData(prev => ({
                ...prev,
                employeeName: employee.employeName,
                employeeId: employee.employeeid,
                department: employee.department || ""
            }));
        } else {
            setFormData(prev => ({ ...prev, employeeId: "", department: "" }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.employeeId) {
            alert("Please enter a valid Employee ID or Employee Name");
            return;
        }
        try {
            const attendanceData = {
                employee: { employeeid: Number(formData.employeeId) },
                date: formData.date,
                checkIn: formData.checkIn || null,
                checkOut: formData.checkOut || null,
                status: formData.status
            };
            await addAttendance(attendanceData);
            alert("Attendance marked successfully");
            await loadTodayAttendance();
            setShowForm(false);
            setFormData({
                employeeId: "",
                employeeName: "",
                department: "",
                date: new Date().toISOString().split("T")[0],
                checkIn: "",
                checkOut: "",
                status: "PRESENT"
            });
        } catch (error) {
            console.error("Attendance save error:", error);
            alert("Could not mark attendance");
        }
    };

    const handleEmployeeHistory = async (employeeId) => {
        if (!employeeId) {
            setSelectedEmployee(null);
            setEmployeeHistory([]);
            return;
        }
        try {
            const data = await getEmployeeAttendance(employeeId);
            setEmployeeHistory(data);
            if (data.length > 0) setSelectedEmployee(data[0].employee);
        } catch (error) {
            console.error(error);
            alert("Could not load employee history");
        }
    };

    const handleMonthlyAttendance = async (employeeId) => {
        if (!employeeId) {
            setMonthlyAttendance([]);
            return;
        }
        try {
            const today = new Date();
            const data = await getMonthlyAttendance(employeeId, today.getFullYear(), today.getMonth() + 1);
            setMonthlyAttendance(data);
        } catch (error) {
            console.error(error);
            alert("Could not load monthly attendance");
        }
    };

    const monthlySummary = attendance.reduce((summary, record) => {
        if (record.status === "PRESENT") summary.present++;
        if (record.status === "ABSENT") summary.absent++;
        if (record.status === "HALF_DAY") summary.halfDay++;
        if (record.status === "LEAVE") summary.leave++;
        return summary;
    }, { present: 0, absent: 0, halfDay: 0, leave: 0 });

    const getStatusBadge = (status) => {
        switch (status) {
            case "PRESENT": return <span className="badge badge-present">Present</span>;
            case "ABSENT": return <span className="badge badge-absent">Absent</span>;
            case "LEAVE": return <span className="badge badge-leave">Leave</span>;
            case "HALF_DAY": return <span className="badge badge-halfday">Half-day</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} />

            <div className="main-section">
                <Navbar onMenuToggle={onMenuToggle} />

                <main className="dashboard">
                    <div className="page-header">
                        <div>
                            <h1>Attendance</h1>
                            <p className="subtitle">Manage employee attendance</p>
                        </div>
                        <button className="add-button" onClick={openAttendanceForm}>
                            {icons.plus} Mark Attendance
                        </button>
                    </div>

                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h3>Present</h3>
                                <div className="card-icon success">{icons.checkCircle}</div>
                            </div>
                            <h2>{monthlySummary.present}</h2>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h3>Absent</h3>
                                <div className="card-icon danger">{icons.xCircle}</div>
                            </div>
                            <h2>{monthlySummary.absent}</h2>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h3>Half-day</h3>
                                <div className="card-icon info">{icons.clock}</div>
                            </div>
                            <h2>{monthlySummary.halfDay}</h2>
                        </div>
                        <div className="dashboard-card">
                            <div className="dashboard-card-header">
                                <h3>Leave</h3>
                                <div className="card-icon warning">{icons.calendar}</div>
                            </div>
                            <h2>{monthlySummary.leave}</h2>
                        </div>
                    </div>

                    <div className="attendance-tabs">
                        <button
                            onClick={() => { setFilter("TODAY"); loadTodayAttendance(); }}
                            className={filter === "TODAY" ? "active-tab" : ""}
                        >
                            Today's Attendance
                        </button>
                        <button
                            onClick={() => setFilter("HISTORY")}
                            className={filter === "HISTORY" ? "active-tab" : ""}
                        >
                            Employee History
                        </button>
                        <button
                            onClick={() => setFilter("MONTH")}
                            className={filter === "MONTH" ? "active-tab" : ""}
                        >
                            Monthly Summary
                        </button>
                    </div>

                    {filter === "TODAY" && (
                        <div className="employee-section">
                            <h2>Today's Attendance</h2>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Date</th>
                                            <th>Check In</th>
                                            <th>Check Out</th>
                                            <th>Status</th>
                                            <th>Working Hours</th>
                                            <th>Overtime</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.length > 0 ? (
                                            attendance.map(record => (
                                                <tr key={record.id}>
                                                    <td><strong>{record.employee?.employeName || record.employeeName || "-"}</strong></td>
                                                    <td>{record.date}</td>
                                                    <td>{record.checkIn || "-"}</td>
                                                    <td>{record.checkOut || "-"}</td>
                                                    <td>{getStatusBadge(record.status)}</td>
                                                    <td>{record.workingHours ?? "-"}</td>
                                                    <td>{record.overtimeHours ?? 0}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="empty-state">No attendance found for today</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {filter === "HISTORY" && (
                        <div className="employee-section">
                            <h2>Employee Attendance History</h2>
                            <select onChange={e => handleEmployeeHistory(e.target.value)}>
                                <option value="">Select Employee</option>
                                {employees.map(employee => (
                                    <option key={employee.employeeid} value={employee.employeeid}>
                                        {employee.employeeid} - {employee.employeName}
                                    </option>
                                ))}
                            </select>
                            {selectedEmployee && (
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Status</th>
                                                <th>Overtime</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeHistory.length > 0 ? (
                                                employeeHistory.map(record => (
                                                    <tr key={record.id}>
                                                        <td>{record.date}</td>
                                                        <td>{record.checkIn || "-"}</td>
                                                        <td>{record.checkOut || "-"}</td>
                                                        <td>{getStatusBadge(record.status)}</td>
                                                        <td>{record.overtimeHours ?? 0}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="empty-state">No attendance history found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {filter === "MONTH" && (
                        <div className="employee-section">
                            <h2>Monthly Attendance</h2>
                            <select onChange={e => handleMonthlyAttendance(e.target.value)}>
                                <option value="">Select Employee</option>
                                {employees.map(employee => (
                                    <option key={employee.employeeid} value={employee.employeeid}>
                                        {employee.employeeid} - {employee.employeName}
                                    </option>
                                ))}
                            </select>
                            {monthlyAttendance.length > 0 && (
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Overtime</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyAttendance.map(record => (
                                                <tr key={record.id}>
                                                    <td>{record.date}</td>
                                                    <td>{getStatusBadge(record.status)}</td>
                                                    <td>{record.checkIn || "-"}</td>
                                                    <td>{record.checkOut || "-"}</td>
                                                    <td>{record.overtimeHours ?? 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="employee-form">
                        <h2>Mark Attendance</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Employee ID</label>
                            <input type="text" name="employeeId" placeholder="Enter Employee ID" value={formData.employeeId} onChange={handleEmployeeIdChange} required />

                            <label>Employee Name</label>
                            <input type="text" name="employeeName" placeholder="Enter Employee Name" value={formData.employeeName} onChange={handleEmployeeNameChange} required />

                            <label>Department</label>
                            <input type="text" value={formData.department} placeholder="Department" readOnly />

                            <label>Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                            <label>Check In</label>
                            <input type="time" name="checkIn" value={formData.checkIn} onChange={handleChange} />

                            <label>Check Out</label>
                            <input type="time" name="checkOut" value={formData.checkOut} onChange={handleChange} />

                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                                <option value="HALF_DAY">Half-day</option>
                                <option value="LEAVE">Leave</option>
                            </select>

                            <div className="form-buttons">
                                <button type="submit" className="add-button">Save Attendance</button>
                                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Attendance;