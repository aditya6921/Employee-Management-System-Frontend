import { icons } from "./Icons";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuToggle }) {
    const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("ownerId");
    localStorage.removeItem("ownerName");
    localStorage.removeItem("ownerEmail");

    navigate("/");
};
    return (
        <header className="navbar">
            <div className="navbar-left">
                <button
                    className="menu-toggle"
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar"
                >
                    {icons.menu}
                </button>

                <div>
                    <div className="breadcrumb">
                       Employee Management & Attendance System
                    </div>
                </div>
            </div>

            <div className="admin-info">
                <button className="notification-btn">
                    {icons.bell}
                    <span className="notification-badge"></span>
                </button>

                <div className="admin-profile">
                    <div className="admin-avatar">A</div>

                    <div className="admin-details">
                        <span className="admin-name">Admin User</span>
                        <span className="admin-role">Administrator</span>
                    </div>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    
                    {icons.logOut}
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;