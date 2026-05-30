import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import "./AdminLayout.css";

import {
    FaBuilding,
    FaChartBar,
    FaUser,
    FaHome,
    FaBars,
    FaHistory   // 🔥 THÊM ICON
} from "react-icons/fa";

export default function AdminLayout() {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const fullName = localStorage.getItem("full_name");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="layout">

            {/* SIDEBAR */}
            <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

                <div className="logo" onClick={() => setCollapsed(!collapsed)}>
                    <FaBars className="logo-icon" />
                    {!collapsed && <span className="logo-text">QL Nhà Đất</span>}
                </div>

                <ul className="menu">

                    <li onClick={() => navigate("/admin")}>
                        <FaChartBar />
                        {!collapsed && <span>Dashboard</span>}
                    </li>

                    <li onClick={() => navigate("/admin/thua-dat")}>
                        <FaHome />
                        {!collapsed && <span>Thửa đất</span>}
                    </li>

                    <li onClick={() => navigate("/admin/cong-trinh")}>
                        <FaBuilding />
                        {!collapsed && <span>Công trình</span>}
                    </li>

                    <li onClick={() => navigate("/admin/chu-so-huu")}>
                        <FaUser />
                        {!collapsed && <span>Chủ sở hữu</span>}
                    </li>
                    {/*ADMIN */}
                    {role === "admin" && (
                        <li onClick={() => navigate("/admin/bien-dong")}>
                            <FaHistory />
                            {!collapsed && <span>Biến động</span>}
                        </li>
                    )}

                    {role === "admin" && (
                        <li onClick={() => navigate("/admin/users")}>
                            👥 {!collapsed && <span>Người dùng</span>}
                        </li>
                    )}

                </ul>

            </div>

            {/* CONTENT */}
            <div className="content">

                <div className="topbar">

                    {/* <input placeholder="🔍 Tìm kiếm..." /> */}

                    <div className="topbar-right">
                        <span className="admin-name">👤 {fullName}</span>
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </div>

                </div>

                <div className="dashboard-body">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}