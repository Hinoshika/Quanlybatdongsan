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
    login,
    forgotPassword,
    verifyOtp,
    resetPassword
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

    const [otpOpen, setOtpOpen] = useState(false);
    const [otpForm] = Form.useForm();

    const [changePassOpen, setChangePassOpen] = useState(false);
    const [changePassForm] = Form.useForm();

    const [usernameReset, setUsernameReset] = useState("");
    const [otpValue, setOtpValue] = useState("");

    const handleForgotPassword = async (values) => {

        try {

            const res = await forgotPassword(values);

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);

            setUsernameReset(values.username);

            setForgotOpen(false);

            setOtpOpen(true);

            forgotForm.resetFields();

        } catch (err) {

            console.log(err);

            alert("Không thể kết nối server");
        }
    };

    const handleVerifyOtp = async (values) => {

        try {

            const res = await verifyOtp({
                username: usernameReset,
                otp: values.otp
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("OTP hợp lệ");

            setOtpValue(values.otp); // 🔥 LƯU OTP LẠI

            setOtpOpen(false);
            setChangePassOpen(true);

            otpForm.resetFields();

        } catch (err) {
            console.log(err);
            alert("Không thể kết nối server");
        }
    };

    const handleChangePassword = async (values) => {

        try {

            const res = await resetPassword({
                username: usernameReset,
                otp: otpValue, // 🔥 BẮT BUỘC PHẢI CÓ
                newPassword: values.newPassword
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("Đổi mật khẩu thành công");

            setChangePassOpen(false);

            changePassForm.resetFields();

            setOtpValue(""); // reset

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

            <Modal
                title="🔐 Xác thực OTP"
                open={otpOpen}
                onCancel={() => setOtpOpen(false)}
                footer={null}
                centered
            >
                <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={handleVerifyOtp}
                >

                    <Form.Item
                        label="Mã OTP"
                        name="otp"
                        rules={[
                            {
                                required: true,
                                message: "Nhập OTP"
                            }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Nhập mã OTP"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Xác thực
                    </Button>

                </Form>
            </Modal>

            {/* FORGOT PASSWORD MODAL */}
            <Modal
                title="🔑 Đổi mật khẩu"
                open={changePassOpen}
                onCancel={() => setChangePassOpen(false)}
                footer={null}
                centered
            >
                <Form
                    form={changePassForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >

                    {/* Mật khẩu mới */}
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Nhập mật khẩu mới"
                            },
                            {
                                min: 6,
                                message: "Tối thiểu 6 ký tự"
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu mới"
                        />
                    </Form.Item>

                    {/* Xác nhận mật khẩu */}
                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Nhập lại mật khẩu"
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu không khớp")
                                    );
                                }
                            })
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập lại mật khẩu"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Đổi mật khẩu
                    </Button>

                </Form>
            </Modal>
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