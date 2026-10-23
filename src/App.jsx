import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Reports from "./pages/Reports";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={<Dashboard sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSidebarClose={closeSidebar} />}
                />
                <Route
                    path="/employees"
                    element={<Employees sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSidebarClose={closeSidebar} />}
                />
                <Route
                    path="/attendance"
                    element={<Attendance sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSidebarClose={closeSidebar} />}
                />
                <Route
                    path="/salary"
                    element={<Salary sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSidebarClose={closeSidebar} />}
                />
                <Route
                    path="/reports"
                    element={<Reports sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSidebarClose={closeSidebar} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
