import { NavLink } from "react-router-dom";
import { icons } from "./Icons";

function Sidebar({ isOpen }) {
    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: icons.layoutDashboard },
        { path: "/employees", label: "Employees", icon: icons.users },
        { path: "/attendance", label: "Attendance", icon: icons.calendarCheck },
        { path: "/salary", label: "Salary", icon: icons.wallet },
        { path: "/reports", label: "Reports", icon: icons.fileText },
    ];

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    {icons.shield}
                </div>

                <div>
                    <div className="sidebar-brand-text">EMAS</div>
                    <div className="sidebar-brand-subtext">
                        Enterprise Suite
                    </div>
                </div>
            </div>

            <nav>
                <div className="sidebar-section-title">Main Menu</div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-footer-item">
                    {icons.user}
                    <span>v2.0 Premium</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;