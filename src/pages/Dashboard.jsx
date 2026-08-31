import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { icons } from "../components/Icons";
import { useEffect, useState } from "react";
import {
    getEmployees,
    getTodayAttendance
} from "../services/api";

function Dashboard({ sidebarOpen, onMenuToggle }) {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError("");
            const employeeData = await getEmployees();
            const attendanceData = await getTodayAttendance();
            setEmployees(employeeData);
            setAttendance(attendanceData);
        } catch (error) {
            console.error(error);
            setError("Could not load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const presentCount = attendance.filter(
        (record) => record.status === "PRESENT"
    ).length;

    const absentCount = attendance.filter(
        (record) => record.status === "ABSENT"
    ).length;

    const leaveCount = attendance.filter(
        (record) => record.status === "LEAVE"
    ).length;

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
                    <h1>Dashboard</h1>
                    <p className="subtitle">Employee attendance overview</p>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            Loading dashboard data...
                        </div>
                    )}

                    {error && (
                        <p className="error">{error}</p>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="dashboard-cards">
                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Total Employees</h3>
                                        <div className="card-icon primary">{icons.usersRound}</div>
                                    </div>
                                    <h2>{employees.length}</h2>
                                    <div className="card-trend">
                                        {icons.trendUp} Active workforce
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Present Today</h3>
                                        <div className="card-icon success">{icons.checkCircle}</div>
                                    </div>
                                    <h2>{presentCount}</h2>
                                    <div className="card-trend">
                                        {icons.trendUp} On time
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>Absent Today</h3>
                                        <div className="card-icon danger">{icons.xCircle}</div>
                                    </div>
                                    <h2>{absentCount}</h2>
                                    <div className="card-trend negative">
                                        {icons.trendDown} Needs attention
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <div className="dashboard-card-header">
                                        <h3>On Leave</h3>
                                        <div className="card-icon warning">{icons.calendar}</div>
                                    </div>
                                    <h2>{leaveCount}</h2>
                                    <div className="card-trend">
                                        {icons.trendUp} Approved
                                    </div>
                                </div>
                            </div>

                            <div className="recent-section">
                                <h2>Today's Attendance</h2>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Department</th>
                                                <th>Check In</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendance.length > 0 ? (
                                                attendance.map((record) => (
                                                    <tr key={record.id}>
                                                        <td>
                                                            <strong>{record.employee?.employeName || "-"}</strong>
                                                        </td>
                                                        <td>{record.employee?.department || "-"}</td>
                                                        <td>{record.checkIn || "-"}</td>
                                                        <td>{getStatusBadge(record.status)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="empty-state">
                                                        No attendance recorded today
                                                    </td>
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

export default Dashboard;