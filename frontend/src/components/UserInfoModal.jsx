import { Modal, Descriptions, Avatar } from "antd";

export default function UserInfoModal({ open, onClose }) {
    const fullName = localStorage.getItem("full_name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return (
        <Modal
            title="Thông tin tài khoản"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
                <Avatar size={64} style={{ backgroundColor: "#1677ff" }}>
                    {fullName?.charAt(0)}
                </Avatar>
            </div>

            <Descriptions bordered column={1}>
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
    );
}