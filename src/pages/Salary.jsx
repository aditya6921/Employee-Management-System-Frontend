import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { icons } from "../components/Icons";
import { useEffect, useState } from "react";
import {
    getEmployees,
    getSalary
} from "../services/api";

function Salary({ sidebarOpen, onMenuToggle }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [salaryData, setSalaryData] = useState(null);
    const [paidLeave, setPaidLeave] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
            if (data.length > 0) setSelectedEmployee(data[0].employeeid);
        } catch (error) {
            console.error(error);
            setError("Could not load employees");
        }
    };

    useEffect(() => {
        if (selectedEmployee) loadSalary();
    }, [selectedEmployee, year, month, paidLeave]);

    const loadSalary = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getSalary(selectedEmployee, year, month, paidLeave);
            setSalaryData(data);
        } catch (error) {
            console.error(error);
            setError("Could not load salary data");
            setSalaryData(null);
        } finally {
            setLoading(false);
        }
    };

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
                            <h1>Salary</h1>
                            <p className="subtitle">Monthly salary and payment calculation</p>
                        </div>
                        <div className="page-header-actions">
                            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(Number(e.target.value))}>
                                <option value="">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.employeeid} value={employee.employeeid}>
                                        {employee.employeeid} - {employee.employeName}
                                    </option>
                                ))}
                            </select>
                            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                {monthNames.map((name, index) => (
                                    <option key={index + 1} value={index + 1}>{name}</option>
                                ))}
                            </select>
                            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="employee-section" style={{ marginBottom: "24px" }}>
                        <label className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={paidLeave}
                                onChange={(e) => setPaidLeave(e.target.checked)}
                            />
                            <span>Paid Leave</span>
                        </label>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            Loading salary...
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    {!loading && salaryData && (
                        <>
                            <div className="dashboard-cards salary-summary">
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Monthly Salary</h3>
                                        <div className="card-icon primary">{icons.indianRupee}</div>
                                    </div>
                                    <h2>₹{salaryData.monthlySalary?.toFixed(2)}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Total Deductions</h3>
                                        <div className="card-icon danger">{icons.indianRupee}</div>
                                    </div>
                                    <h2>₹{salaryData.totalDeduction?.toFixed(2)}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Overtime Pay</h3>
                                        <div className="card-icon success">{icons.indianRupee}</div>
                                    </div>
                                    <h2>₹{salaryData.overtimePay?.toFixed(2)}</h2>
                                </div>
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Final Payable</h3>
                                        <div className="card-icon info">{icons.indianRupee}</div>
                                    </div>
                                    <h2>₹{salaryData.finalPayableSalary?.toFixed(2)}</h2>
                                </div>
                            </div>

                            <div className="employee-section">
                                <h2>Salary Details</h2>
                                <div className="table-wrapper">
                                    <table className="salary-details-table">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Employee</td>
                                                <td><strong>{salaryData.employeeName}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Monthly Salary</td>
                                                <td>₹{salaryData.monthlySalary?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Absent Days</td>
                                                <td>{salaryData.absentDays}</td>
                                            </tr>
                                            <tr>
                                                <td>Absent Deduction</td>
                                                <td className="amount-negative">- ₹{salaryData.absentDeduction?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Half-day</td>
                                                <td>{salaryData.halfDays}</td>
                                            </tr>
                                            <tr>
                                                <td>Half-day Deduction</td>
                                                <td className="amount-negative">- ₹{salaryData.halfDayDeduction?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Leave Days</td>
                                                <td>{salaryData.leaveDays}</td>
                                            </tr>
                                            <tr>
                                                <td>Leave Deduction</td>
                                                <td className="amount-negative">- ₹{salaryData.leaveDeduction?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Deduction</td>
                                                <td className="amount-negative">- ₹{salaryData.totalDeduction?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Overtime Hours</td>
                                                <td>{salaryData.totalOvertimeHours?.toFixed(2)} hours</td>
                                            </tr>
                                            <tr>
                                                <td>Hourly Salary</td>
                                                <td>₹{salaryData.hourlySalary?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Overtime Pay</td>
                                                <td className="amount-positive">+ ₹{salaryData.overtimePay?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <th>Final Payable Salary</th>
                                                <th>₹{salaryData.finalPayableSalary?.toFixed(2)}</th>
                                            </tr>
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

export default Salary;