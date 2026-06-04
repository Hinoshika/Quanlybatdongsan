import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import {
    FaBuilding,
    FaChartBar,
    FaUser,
    FaHome,
    FaBars,
    FaHistory
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

    const menuItems = [
        { icon: <FaChartBar />, label: "Dashboard", path: "/admin" },
        { icon: <FaHome />, label: "Thửa đất", path: "/admin/thua-dat" },
        { icon: <FaBuilding />, label: "Công trình", path: "/admin/cong-trinh" },
        { icon: <FaUser />, label: "Chủ sở hữu", path: "/admin/chu-so-huu" },
    ];

    const adminItems = [
        { icon: <FaHistory />, label: "Biến động", path: "/admin/bien-dong" },
        { icon: <span>👥</span>, label: "Người dùng", path: "/admin/users" },
    ];

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* SIDEBAR */}
            <div style={{
                width: collapsed ? "80px" : "260px",
                backgroundColor: "#1e293b",
                color: "white",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s",
                overflow: "hidden"
            }}>
                <div style={{
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: "0 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer"
                }} onClick={() => setCollapsed(!collapsed)}>
                    <FaBars style={{ fontSize: "1.5rem", minWidth: "24px" }} />
                    {!collapsed && <span style={{ marginLeft: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>QL Nhà Đất</span>}
                </div>

                <ul style={{ listStyle: "none", padding: "20px 10px" }}>
                    {[...menuItems, ...(role === "admin" ? adminItems : [])].map((item, index) => (
                        <li key={index} onClick={() => navigate(item.path)} style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 15px",
                            marginBottom: "8px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            color: "#cbd5e1",
                            justifyContent: collapsed ? "center" : "flex-start",
                            transition: "background 0.2s"
                        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                            <span style={{ minWidth: "20px", display: "flex" }}>{item.icon}</span>
                            {!collapsed && <span style={{ marginLeft: "15px" }}>{item.label}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                <div style={{
                    height: "70px",
                    backgroundColor: "white",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 30px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <span style={{ fontWeight: "600" }}>👤 {fullName}</span>
                        <button onClick={handleLogout} style={{
                            backgroundColor: "transparent",
                            border: "1px solid #e2e8f0",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}>Đăng xuất</button>
                    </div>
                </div>

                <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}