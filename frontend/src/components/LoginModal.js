import {
    Modal,
    Form,
    Input,
    Button
} from "antd";

import {
    UserOutlined,
    LockOutlined,
    MailOutlined
} from "@ant-design/icons";

import {
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    login
} from "../services/auth.service";

export default function LoginModal({
    open,
    onClose
}) {

    const [form] = Form.useForm();

    const passwordRef = useRef(null);

    const navigate = useNavigate();

    // ================= FORGOT PASSWORD =================

    const [forgotOpen, setForgotOpen] = useState(false);

    const [forgotForm] = Form.useForm();

    const handleForgotPassword = async (values) => {

        try {

            const res = await fetch(
                "http://localhost:3000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                }
            );

            const data = await res.json();

            if (!res.ok) {

                alert(data.message);

                return;
            }

            alert(data.message);

            setForgotOpen(false);

            forgotForm.resetFields();

        } catch (err) {

            console.log(err);

            alert("Không thể kết nối server");
        }
    };
    // ================= LOGIN =================

    const handleLogin = async (values) => {

        try {

            const res = await login(values);

            const data = await res.json();

            if (!res.ok) {

                alert(data.message || "Sai tài khoản");

                return;
            }

            const user = data.user;

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "role",
                user.roles?.[0] || ""
            );

            localStorage.setItem(
                "full_name",
                user.full_name
            );

            alert("Đăng nhập thành công");

            const roles = user.roles || [];

            if (roles.includes("admin")) {

                navigate("/admin");

            } else if (roles.includes("canbo")) {

                navigate("/admin");

            } else {

                navigate("/");
            }

            onClose();

        } catch (err) {

            console.log("LOGIN ERROR:", err);

            alert("Không thể kết nối server");
        }
    };

    return (
        <>

            {/* LOGIN MODAL */}

            <Modal
                title="🔐 Đăng nhập hệ thống"
                open={open}
                onCancel={onClose}
                footer={null}
                centered
                width={450}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 20
                    }}
                >
                    <p style={{ color: "#888" }}>
                        Vui lòng đăng nhập để tiếp tục
                    </p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleLogin}
                >

                    {/* USERNAME */}

                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Nhập tài khoản!"
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Tài khoản"
                            size="large"
                            onPressEnter={() =>
                                passwordRef.current?.focus()
                            }
                        />
                    </Form.Item>

                    {/* PASSWORD */}

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Nhập mật khẩu!"
                            }
                        ]}
                    >
                        <Input.Password
                            ref={passwordRef}
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                            onPressEnter={() =>
                                form.submit()
                            }
                        />
                    </Form.Item>

                    {/* BUTTON */}

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                    >
                        Đăng nhập
                    </Button>

                    {/* FORGOT PASSWORD */}

                    <div
                        style={{
                            textAlign: "right",
                            marginTop: 10
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setForgotOpen(true)
                            }
                            style={{
                                border: "none",
                                background: "none",
                                color: "#1677ff",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                </Form>

            </Modal>

            {/* FORGOT PASSWORD MODAL */}

            {/* FORGOT PASSWORD MODAL */}

            <Modal
                title="🔑 Khôi phục mật khẩu"
                open={forgotOpen}
                onCancel={() =>
                    setForgotOpen(false)
                }
                footer={null}
                centered
            >

                <Form
                    form={forgotForm}
                    layout="vertical"
                    onFinish={handleForgotPassword}
                >

                    {/* USERNAME */}

                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Nhập tên tài khoản!"
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập tên tài khoản"
                            size="large"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                    >
                        Gửi yêu cầu
                    </Button>

                </Form>

            </Modal>

        </>
    );
}