import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
    Layout,
    Menu,
    Button,
    Avatar,
    Dropdown,
    Badge
} from "antd";

import {
    HomeOutlined,
    SearchOutlined,
    FileTextOutlined,
    LogoutOutlined,
    UserOutlined,
    BellOutlined
} from "@ant-design/icons";

import LoginModal from "../components/LoginModal";
import { getYeuCau } from "../services/yeucau.service";

const { Header, Content } = Layout;

export default function ClientLayout() {
    const navigate = useNavigate();

    const [openLogin, setOpenLogin] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const fullName = localStorage.getItem("full_name");

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    // ===== lấy số yêu cầu của user =====
    const fetchPending = async () => {
        try {

            const data = await getYeuCau();


            const list = Array.isArray(data)
                ? data
                : data.data || [];


            const count = list.filter(
                item =>
                    item.trang_thai?.toUpperCase() === "CHO_XU_LY"
            ).length;


            setPendingCount(count);


        } catch (err) {

            console.error(
                "Lỗi lấy yêu cầu:",
                err
            );

        }
    };

    useEffect(() => {

        if (!fullName) return;

        fetchPending();

        const interval = setInterval(
            fetchPending,
            10000
        );

        return () => clearInterval(interval);

    }, [fullName]);

    // ===== menu dropdown user =====
    const items = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Trang cá nhân",
            onClick: () => navigate("/profile"),
        },
        {
            key: "request-manage",
            icon: <FileTextOutlined />,
            label: "Quản lý yêu cầu",
            onClick: () => navigate("/requestuser"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            danger: true,
            label: "Đăng xuất",
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>

            {/* HEADER */}
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "0 16px",
                    height: 64,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    onClick={() => navigate("/")}
                >
                    🏠 QL Nhà Đất
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ flex: 1, borderBottom: "none" }}
                    onClick={(e) => navigate(`/${e.key}`)}
                    items={[
                        { key: "", icon: <HomeOutlined />, label: "Trang chủ" },
                        { key: "search", icon: <SearchOutlined />, label: "Tra cứu" },
                        { key: "request", icon: <FileTextOutlined />, label: "Yêu cầu" },
                    ]}
                />

                {/* ===== NOTIFICATION BELL ===== */}
                {fullName && (
                    <div
                        style={{
                            marginRight: 20,
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/requestuser")}
                    >
                        <Badge count={pendingCount} size="small">
                            <BellOutlined
                                style={{
                                    fontSize: 20,
                                    color: "white"
                                }}
                            />
                        </Badge>
                    </div>
                )}

                {/* ===== USER ===== */}
                {fullName ? (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            <Avatar style={{ backgroundColor: "#1677ff" }}>
                                {fullName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <span>{fullName}</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Button type="primary" onClick={() => setOpenLogin(true)}>
                        Đăng nhập
                    </Button>
                )}
            </Header>

            {/* CONTENT */}
            <Content
                style={{
                    minHeight: "calc(100vh - 64px)",
                    background: "#f5f5f5",
                }}
            >
                <Outlet />
            </Content>

            {/* LOGIN MODAL */}
            <LoginModal
                open={openLogin}
                onClose={() => setOpenLogin(false)}
            />
        </Layout>
    );
}