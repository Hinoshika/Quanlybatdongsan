import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import "./canbolayout.css";

import {
    FaHome,
    FaChartBar,
    FaBuilding,
    FaBars
} from "react-icons/fa";

export default function CanBoLayout() {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const fullName = localStorage.getItem("full_name");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="layout">

            {/* SIDEBAR */}
            <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

                {/* LOGO */}
                <div
                    className="logo"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                    {!collapsed && <span>QL Cán Bộ</span>}
                </div>

                {/* MENU */}
                <ul className="menu">

                    <li onClick={() => navigate("/can-bo")}>
                        <FaChartBar />
                        {!collapsed && <span>Dashboard</span>}
                    </li>

                    <li onClick={() => navigate("/can-bo/thua-dat")}>
                        <FaHome />
                        {!collapsed && <span>Thửa đất</span>}
                    </li>

                    <li onClick={() => navigate("/can-bo/cong-trinh")}>
                        <FaBuilding />
                        {!collapsed && <span>Công trình</span>}
                    </li>

                </ul>
            </div>

            {/* CONTENT */}
            <div className="content">

                {/* TOPBAR */}
                <div className="topbar">

                    <input placeholder="🔍 Tìm kiếm..." />

                    <div className="topbar-right">
                        <span>👤 {fullName}</span>

                        <button onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>

                </div>

                {/* BODY */}
                <div className="body">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}