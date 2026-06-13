import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
    Layout,
    Menu,
    Input,
    Button,
    Avatar,
    Dropdown,
    Modal,
    Descriptions
} from "antd";

import {
    HomeOutlined,
    BankOutlined,
    UserOutlined,
    SearchOutlined,
    FileTextOutlined,
    LogoutOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";

import LoginModal from "../components/LoginModal";

const { Header, Content } = Layout;

export default function ClientLayout() {
    const navigate = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);

    const fullName = localStorage.getItem("full_name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const items = [
        {
            key: "profile",
            label: "Trang cá nhân",
            onClick: () => navigate("/profile")
        },
        {
            key: "logout",
            label: (
                <span
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Đăng xuất
                </span>
            )
        }
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
                    lineHeight: "64px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000
                }}
            >
                <div style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                    🏠 QL Nhà Đất
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{
                        flex: 1,
                        borderBottom: "none"
                    }}
                    onClick={(e) => navigate(`/${e.key}`)}
                    items={[
                        { key: "", icon: <HomeOutlined />, label: "Trang chủ" },
                        { key: "search", icon: <SearchOutlined />, label: "Tìm kiếm" },
                        { key: "request", icon: <FileTextOutlined />, label: "Yêu cầu" },
                        { key: "market", icon: <BankOutlined />, label: "Thị trường" },
                        // { key: "user", icon: <UserOutlined />, label: "Người dùng" }
                    ]}
                />
                {/* 
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    style={{ width: 220 }}
                /> */}

                {fullName ? (
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            <Avatar style={{ backgroundColor: "#1677ff" }}>
                                {fullName?.charAt(0)}
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
                    background: "#f5f5f5"
                }}
            >
                <Outlet />
            </Content>

            {/* LOGIN MODAL */}
            <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />

            {/* USER INFO MODAL */}
            <Modal
                title="Thông tin tài khoản"
                open={openInfo}
                onCancel={() => setOpenInfo(false)}
                footer={null}
            >
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Họ tên">
                        {fullName || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {email || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                        {role || "USER"}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>

        </Layout>
    );
}