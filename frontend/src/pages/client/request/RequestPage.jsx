import {
    Card,
    Form,
    Input,
    Select,
    Button,
    message
} from "antd";

import { createYeuCau } from "../../../services/yeucau.service";

const { TextArea } = Input;

export default function RequestPage() {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user?.id) {
            message.warning(
                "Vui lòng đăng nhập để gửi yêu cầu"
            );
            return;
        }

        try {
            await createYeuCau({
                nguoi_gui_id: user.id,
                loai_yeu_cau: values.loai_yeu_cau,
                noi_dung: `${values.tieu_de}\n\n${values.noi_dung}`
            });

            message.success(
                "Gửi yêu cầu thành công"
            );

            form.resetFields();
        } catch (error) {
            message.error(
                error?.message ||
                "Gửi yêu cầu thất bại"
            );
        }
    };

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "24px auto"
            }}
        >
            <Card title="Gửi yêu cầu">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Loại yêu cầu"
                        name="loai_yeu_cau"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng chọn loại yêu cầu"
                            }
                        ]}
                    >
                        <Select
                            placeholder="Chọn loại yêu cầu"
                            options={[
                                {
                                    value: "Cập nhật thửa đất",
                                    label: "Cập nhật thửa đất"
                                },
                                {
                                    value: "Cập nhật chủ sở hữu",
                                    label: "Cập nhật chủ sở hữu"
                                },
                                {
                                    value: "Cập nhật công trình",
                                    label: "Cập nhật công trình"
                                },
                                {
                                    value: "Khiếu nại",
                                    label: "Khiếu nại"
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề"
                        name="tieu_de"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập tiêu đề"
                            }
                        ]}
                    >
                        <Input placeholder="Nhập tiêu đề yêu cầu" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="noi_dung"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập nội dung"
                            }
                        ]}
                    >
                        <TextArea
                            rows={5}
                            placeholder="Nhập nội dung chi tiết"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Gửi yêu cầu
                    </Button>
                </Form>
            </Card>
        </div>
    );
}