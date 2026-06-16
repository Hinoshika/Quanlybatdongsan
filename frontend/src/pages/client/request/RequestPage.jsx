import { useState } from "react";
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Upload,
    message,
    Space
} from "antd";
import {
    UploadOutlined,
    SendOutlined
} from "@ant-design/icons";

import { createYeuCau } from "../../../services/yeucau.service";

const { TextArea } = Input;

export default function RequestPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

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
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "nguoi_gui_id",
                user.id
            );

            formData.append(
                "loai_yeu_cau",
                values.loai_yeu_cau
            );

            formData.append(
                "noi_dung",
                values.noi_dung
            );

            fileList.forEach((file) => {
                formData.append(
                    "files",
                    file.originFileObj
                );
            });

            await createYeuCau(formData);

            message.success(
                "Gửi yêu cầu thành công"
            );

            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error(error);

            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "Gửi yêu cầu thất bại"
            );
        } finally {
            setLoading(false);
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
                                    value:
                                        "Cập nhật thửa đất",
                                    label:
                                        "Cập nhật thửa đất"
                                },
                                {
                                    value:
                                        "Cập nhật chủ sở hữu",
                                    label:
                                        "Cập nhật chủ sở hữu"
                                },
                                {
                                    value:
                                        "Cập nhật công trình",
                                    label:
                                        "Cập nhật công trình"
                                },
                                {
                                    value:
                                        "Khiếu nại",
                                    label:
                                        "Khiếu nại"
                                }
                            ]}
                        />
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
                            rows={6}
                            placeholder="Nhập nội dung chi tiết"
                        />
                    </Form.Item>

                    <Form.Item label="Tệp đính kèm">
                        <Upload
                            multiple
                            fileList={fileList}
                            beforeUpload={(file) => {
                                const isLt10M =
                                    file.size /
                                    1024 /
                                    1024 <
                                    10;

                                if (
                                    !isLt10M
                                ) {
                                    message.error(
                                        `${file.name} vượt quá 10MB`
                                    );
                                    return Upload.LIST_IGNORE;
                                }

                                return false;
                            }}
                            onChange={({
                                fileList
                            }) =>
                                setFileList(
                                    fileList
                                )
                            }
                            maxCount={10}
                        >
                            <Button
                                icon={
                                    <UploadOutlined />
                                }
                            >
                                Chọn tệp
                            </Button>
                        </Upload>

                        <div
                            style={{
                                marginTop: 8,
                                color: "#888",
                                fontSize: 12
                            }}
                        >
                            Hỗ trợ upload
                            PDF, Word,
                            Excel, hình ảnh...
                            (tối đa 10
                            file)
                        </div>
                    </Form.Item>

                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={
                                <SendOutlined />
                            }
                        >
                            Gửi yêu cầu
                        </Button>

                        <Button
                            onClick={() => {
                                form.resetFields();
                                setFileList(
                                    []
                                );
                            }}
                        >
                            Làm mới
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}