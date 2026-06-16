import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Select,
    Row,
    Col,
    message,
    Divider
} from "antd";

import { useState } from "react";

const { Option } = Select;

export default function Settings() {
    const [loading, setLoading] = useState(false);

    const handleSave = async (values) => {
        try {

            setLoading(true);

            console.log("SETTINGS:", values);

            message.success(
                "Lưu cài đặt thành công"
            );

        } catch (error) {

            message.error(
                "Lưu cài đặt thất bại"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: "0 auto"
            }}
        >
            <Form
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    ten_he_thong:
                        "Hệ thống quản lý bất động sản",
                    ngon_ngu: "vi",
                    thong_bao: true,
                    cho_phep_dang_ky: false
                }}
            >
                <Row gutter={[16, 16]}>

                    {/* THÔNG TIN CHUNG */}
                    <Col span={12}>
                        <Card title="Thông tin hệ thống">

                            <Form.Item
                                label="Tên hệ thống"
                                name="ten_he_thong"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ cơ quan"
                                name="dia_chi"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email liên hệ"
                                name="email"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="so_dien_thoai"
                            >
                                <Input />
                            </Form.Item>

                        </Card>
                    </Col>

                    {/* CẤU HÌNH HỆ THỐNG */}
                    <Col span={12}>
                        <Card title="Cấu hình hệ thống">

                            <Form.Item
                                label="Ngôn ngữ"
                                name="ngon_ngu"
                            >
                                <Select>
                                    <Option value="vi">
                                        Tiếng Việt
                                    </Option>

                                    <Option value="en">
                                        English
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Bật thông báo"
                                name="thong_bao"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="Cho phép đăng ký tài khoản"
                                name="cho_phep_dang_ky"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                        </Card>
                    </Col>

                    {/* AI */}
                    <Col span={12}>
                        <Card title="Cấu hình AI">

                            <Form.Item
                                label="Gemini API Key"
                                name="gemini_api_key"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Model AI"
                                name="gemini_model"
                            >
                                <Input
                                    placeholder="gemini-2.5-flash"
                                />
                            </Form.Item>

                        </Card>
                    </Col>

                    {/* EMAIL */}
                    <Col span={12}>
                        <Card title="Email SMTP">

                            <Form.Item
                                label="SMTP Host"
                                name="smtp_host"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="SMTP Port"
                                name="smtp_port"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="SMTP User"
                                name="smtp_user"
                            >
                                <Input />
                            </Form.Item>

                        </Card>
                    </Col>

                </Row>

                <Divider />

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                >
                    Lưu cài đặt
                </Button>
            </Form>
        </div>
    );
}
