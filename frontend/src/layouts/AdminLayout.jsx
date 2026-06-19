import { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaChartBar,
  FaUser,
  FaHome,
  FaHistory,
  FaClipboardCheck,
  FaUsers,
  FaSignOutAlt,
  FaCog,
  FaMapMarkerAlt,
  FaChevronLeft,
} from "react-icons/fa";

import { notification, Badge } from "antd";
import axios from "axios";

import "./AdminLayout.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const firstLoad = useRef(true);

  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "admin";
  const fullName = localStorage.getItem("full_name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchPendingCount = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/yeu-cau");

      const count = data.filter(
        (item) =>
          item.trang_thai && item.trang_thai.toUpperCase() === "CHO_XU_LY",
      ).length;

      if (!firstLoad.current && count > pendingCount) {
        notification.warning({
          message: "Có yêu cầu mới",
          description: `Có ${count - pendingCount} yêu cầu mới cần xử lý.`,
          placement: "topRight",
          duration: 3,
        });
      }

      setPendingCount(count);

      if (firstLoad.current) {
        firstLoad.current = false;
      }
    } catch (err) {
      console.error("Lỗi lấy yêu cầu:", err);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    const interval = setInterval(() => {
      fetchPendingCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [pendingCount]);

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        {
          icon: <FaChartBar />,
          label: "Dashboard",
          path: "/admin",
          exact: true,
        },
      ],
    },
    {
      title: "Quản lý dữ liệu",
      items: [
        {
          icon: <FaHome />,
          label: "Thửa đất",
          path: "/admin/thua-dat",
        },
        {
          icon: <FaBuilding />,
          label: "Công trình",
          path: "/admin/cong-trinh",
        },
        {
          icon: <FaUser />,
          label: "Chủ sở hữu",
          path: "/admin/chu-so-huu",
        },
      ],
    },
    {
      title: "Nghiệp vụ",
      items: [
        {
          icon: <FaClipboardCheck />,
          label: "Xử lý yêu cầu",
          badge: pendingCount,
          path: "/admin/xu-ly-yeu-cau",
        },
        {
          icon: <FaMapMarkerAlt />,
          label: "Hệ thống bản đồ",
          path: "/admin/ban-do",
        },
      ],
    },
    {
      title: "Quản trị",
      items: [
        {
          icon: <FaHistory />,
          label: "Lịch sử biến động",
          path: "/admin/bien-dong",
        },
      ],
      roles: ["admin"],
    },
    {
      title: "Hệ thống",
      items: [
        {
          icon: <FaUsers />,
          label: "Người dùng",
          path: "/admin/users",
        },
        {
          icon: <FaHistory />,
          label: "Lịch sử hệ thống",
          path: "/admin/system-history",
        },
        {
          icon: <FaCog />,
          label: "Cài đặt",
          path: "/admin/settings",
        },
        {
          icon: <FaCog />,
          label: "Test",
          path: "/admin/Test",
        },
        {
          icon: <FaCog />,
          label: "Test1",
          path: "/admin/Test1",
        },
      ],
      roles: ["admin"],
    },
  ];

  const checkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }

    return location.pathname.startsWith(item.path);
  };

  const currentPage =
    menuGroups.flatMap((group) => group.items).find((item) => checkActive(item))
      ?.label || "Dashboard";

  return (
    <div className="admin-wrapper">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <FaMapMarkerAlt />
          </div>

          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">QL Bất Động Sản</div>
              {/* <div className="logo-subtitle">
                                Quản lý đất đai
                            </div> */}
            </div>
          )}
        </div>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          <FaChevronLeft className={`chevron ${collapsed ? "rotate" : ""}`} />
        </button>

        <nav className="nav-section">
          {menuGroups.map((group, idx) => {
            if (group.roles && !group.roles.includes(role)) {
              return null;
            }

            return (
              <div key={idx} className="menu-group">
                {!collapsed && <div className="group-title">{group.title}</div>}

                {group.items.map((item, index) => {
                  const active = checkActive(item);

                  return (
                    <div
                      key={index}
                      className={`menu-item ${active ? "active" : ""}`}
                      onClick={() => navigate(item.path)}
                    >
                      <span className="icon">{item.icon}</span>

                      {!collapsed && (
                        <div className="menu-label-wrapper">
                          <span className="label">{item.label}</span>
                          {item.badge > 0 && (
                            <Badge
                              count={item.badge}
                              size="small"
                              offset={[10, 0]}
                              overflowCount={99}
                            />
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

        <div className="user-profile">
          <div className="avatar">{fullName.charAt(0).toUpperCase()}</div>

          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{fullName}</div>
              <div className="user-role">{role}</div>
            </div>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <h1 className="page-title">{currentPage}</h1>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
