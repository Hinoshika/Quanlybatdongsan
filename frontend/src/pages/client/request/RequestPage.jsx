import {
    Card,
    Form,
    Input,
    Select,
    Button,
    message
} from "antd";

const { TextArea } = Input;

export default function RequestPage() {

    const onFinish = (values) => {
        console.log(values);

        message.success(
            "Gửi yêu cầu thành công"
        );
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
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Loại yêu cầu"
                        name="loai_yeu_cau"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Select
                            options={[
                                {
                                    value: "cap_moi",
                                    label: "Cấp mới giấy chứng nhận"
                                },
                                {
                                    value: "tach_thua",
                                    label: "Tách thửa"
                                },
                                {
                                    value: "hop_thua",
                                    label: "Hợp thửa"
                                },
                                {
                                    value: "chuyen_nhuong",
                                    label: "Chuyển nhượng"
                                },
                                {
                                    value: "khieu_nai",
                                    label: "Khiếu nại / phản ánh"
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề"
                        name="tieu_de"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="noi_dung"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <TextArea rows={5} />
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