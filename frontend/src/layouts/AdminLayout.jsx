import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
    FaBuilding, FaChartBar, FaUser, FaHome,
    FaHistory, FaClipboardCheck, FaUsers, FaSignOutAlt,
    FaCog, FaMapMarkerAlt, FaChevronLeft
} from "react-icons/fa";

import "./AdminLayout.css";
import axios from "axios";


export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const role = localStorage.getItem("role") || "admin";
    const fullName = localStorage.getItem("full_name") || "Admin";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        fetchPendingCount();
    }, []);

    const fetchPendingCount = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/yeu-cau"
            );

            const count = res.data.filter(
                item => item.trang_thai === "CHO_XU_LY"
            ).length;

            setPendingCount(count);
        } catch (err) {
            console.error(err);
        }
    };

    const menuGroups = [
        {
            title: "Tổng quan",
            items: [
                { icon: <FaChartBar />, label: "Dashboard", path: "/admin", exact: true }
            ]
        },
        {
            title: "Quản lý dữ liệu",
            items: [
                { icon: <FaHome />, label: "Thửa đất", path: "/admin/thua-dat" },
                { icon: <FaBuilding />, label: "Công trình", path: "/admin/cong-trinh" },
                { icon: <FaUser />, label: "Chủ sở hữu", path: "/admin/chu-so-huu" },
            ]
        },
        {
            title: "Nghiệp vụ",
            items: [
                {
                    icon: <FaClipboardCheck />,
                    label: "Xử lý yêu cầu",
                    badge: pendingCount,
                    path: "/admin/xu-ly-yeu-cau"
                },
                { icon: <FaHistory />, label: "Lịch sử biến động", path: "/admin/bien-dong" },
            ]
        },
        {
            title: "Hệ thống",
            items: [
                { icon: <FaUsers />, label: "Người dùng", path: "/admin/users" },
                { icon: <FaCog />, label: "Cài đặt", path: "/admin/settings" },
            ],
            roles: ["admin"]
        }
    ];

    const checkActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const currentPage = menuGroups
        .flatMap(g => g.items)
        .find(i => checkActive(i))?.label || "Dashboard";

    return (
        <div className="admin-wrapper">

            {/* SIDEBAR */}
            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

                {/* LOGO */}
                <div className="logo-section">
                    <div className="logo-icon">
                        <FaMapMarkerAlt />
                    </div>
                    {!collapsed && (
                        <div className="logo-text">
                            <div className="logo-title">LandManager</div>
                            <div className="logo-subtitle">Quản lý đất đai</div>
                        </div>
                    )}
                </div>

                {/* TOGGLE BUTTON */}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Mở rộng" : "Thu gọn"}
                >
                    <FaChevronLeft className={`chevron ${collapsed ? "rotate" : ""}`} />
                </button>

                {/* MENU */}
                <nav className="nav-section">
                    {menuGroups.map((group, idx) => {
                        if (group.roles && !group.roles.includes(role)) return null;

                        return (
                            <div key={idx} className="menu-group">
                                {!collapsed && (
                                    <div className="group-title">{group.title}</div>
                                )}

                                {group.items.map((item, i) => {
                                    const active = checkActive(item);

                                    return (
                                        <div
                                            key={i}
                                            className={`menu-item ${active ? "active" : ""}`}
                                            onClick={() => navigate(item.path)}
                                        >
                                            <span className="icon">
                                                {item.icon}
                                            </span>

                                            {!collapsed && (
                                                <div className="menu-label-wrapper">
                                                    <span className="label">
                                                        {item.label}
                                                    </span>

                                                    {item.badge > 0 && (
                                                        <span className="menu-notification">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* USER */}
                <div className="user-profile">
                    <div className="avatar">
                        {fullName.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="user-info">
                            <div className="user-name">{fullName}</div>
                            <div className="user-role">{role}</div>
                        </div>
                    )}
                </div>
            </aside>

            {/* MAIN */}
            <main className="main">
                {/* HEADER */}
                <header className="header">
                    <h1 className="page-title">{currentPage}</h1>

                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Đăng xuất</span>
                    </button>
                </header>

                {/* CONTENT */}
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}