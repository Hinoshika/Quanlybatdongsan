import { Card, Avatar, Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const fullName = localStorage.getItem("full_name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const cccd = localStorage.getItem("cccd");
    const address = localStorage.getItem("address");
    const phone = localStorage.getItem("phone");

    return (
        <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <Card
                style={{ width: 600 }}
                title="Thông tin tài khoản"
                extra={
                    <Button onClick={() => navigate("/")}>
                        ← Quay lại
                    </Button>
                }
            >
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Avatar size={80} style={{ backgroundColor: "#1677ff" }}>
                        {fullName?.charAt(0)}
                    </Avatar>

                    <h2 style={{ marginTop: 10 }}>{fullName}</h2>
                    <p style={{ color: "gray" }}>{role || "USER"}</p>
                </div>

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

                    <Descriptions.Item label="CCCD">
                        {cccd || "Chưa cập nhật"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Địa chỉ">
                        {address || "Chưa cập nhật"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}