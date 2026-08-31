import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { icons } from "../components/Icons";
import { useEffect, useState } from "react";
import {
    getEmployees,
    getMonthlyAttendance,
    getSalary
} from "../services/api";

function Reports({ sidebarOpen, onMenuToggle }) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [employees, setEmployees] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        if (employees.length > 0) loadReports();
    }, [employees, year, month]);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
            setError("Could not load employees");
        } finally {
            setLoading(false);
        }
    };

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");
            const reportData = [];
            for (const employee of employees) {
                try {
                    const attendance = await getMonthlyAttendance(employee.employeeid, year, month);
                    const present = attendance.filter(r => r.status === "PRESENT").length;
                    const absent = attendance.filter(r => r.status === "ABSENT").length;
                    const halfDay = attendance.filter(r => r.status === "HALF_DAY").length;
                    const leave = attendance.filter(r => r.status === "LEAVE").length;
                    const overtime = attendance.reduce((total, record) => total + (record.overtimeHours || 0), 0);
                    const salary = await getSalary(employee.employeeid, year, month, true);
                    reportData.push({
                        employeeId: employee.employeeid,
                        employeeName: employee.employeName,
                        present,
                        absent,
                        halfDay,
                        leave,
                        overtime,
                        salaryPayable: salary.finalPayableSalary || 0
                    });
                } catch (employeeError) {
                    console.error(`Error loading employee ${employee.employeeid}`, employeeError);
                }
            }
            setReports(reportData);
        } catch (error) {
            console.error(error);
            setError("Could not load report data");
        } finally {
            setLoading(false);
        }
    };

    const totalEmployees = employees.length;
    const totalPresent = reports.reduce((total, report) => total + report.present, 0);
    const totalAbsent = reports.reduce((total, report) => total + report.absent, 0);
    const totalOvertime = reports.reduce((total, report) => total + report.overtime, 0);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} />

            <div className="main-section">
                <Navbar onMenuToggle={onMenuToggle} />

                <main className="dashboard">
                    <div className="page-header">
                        <div>
                            <h1>Reports</h1>
                            <p className="subtitle">Employee attendance and salary reports</p>
                        </div>
                        <div className="page-header-actions">
                            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                {monthNames.map((name, index) => (
                                    <option key={index + 1} value={index + 1}>{name}</option>
                                ))}
                            </select>
                            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                        </div>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            Loading reports...
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <div className="dashboard-cards">
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Total Employees</h3>
                                        <div className="card-icon primary">{icons.usersRound}</div>
                                    </div>
                                    <h2>{totalEmployees}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Present Days</h3>
                                        <div className="card-icon success">{icons.checkCircle}</div>
                                    </div>
                                    <h2>{totalPresent}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Absent Days</h3>
                                        <div className="card-icon danger">{icons.xCircle}</div>
                                    </div>
                                    <h2>{totalAbsent}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Total Overtime</h3>
                                        <div className="card-icon warning">{icons.clock}</div>
                                    </div>
                                    <h2>{totalOvertime.toFixed(2)} hrs</h2>
                                </div>
                            </div>

                            <div className="employee-section">
                                <h2>Monthly Employee Report — {monthNames[month - 1]} {year}</h2>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Present</th>
                                                <th>Absent</th>
                                                <th>Half-day</th>
                                                <th>Leave</th>
                                                <th>Overtime</th>
                                                <th>Salary Payable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.length > 0 ? (
                                                reports.map((report) => (
                                                    <tr key={report.employeeId}>
                                                        <td><strong>{report.employeeName}</strong></td>
                                                        <td>{report.present}</td>
                                                        <td>{report.absent}</td>
                                                        <td>{report.halfDay}</td>
                                                        <td>{report.leave}</td>
                                                        <td>{report.overtime.toFixed(2)} hrs</td>
                                                        <td><strong>₹{report.salaryPayable.toFixed(2)}</strong></td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="empty-state">No report data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Reports;