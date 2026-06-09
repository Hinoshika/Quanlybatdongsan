import { useEffect, useState } from "react";
import {
    Card,
    Table,
    Tag,
    Button,
    Modal,
    Form,
    Input,
    Descriptions,
    message,
    Space,
} from "antd";
import axios from "axios";

const { TextArea } = Input;

export default function XuLyYeuCau() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/yeu-cau");
            setData(res.data);
        } catch {
            message.error("Không tải được dữ liệu");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (record) => {
        setSelected(record);

        form.setFieldsValue({
            ghi_chu_xu_ly: record.ghi_chu_xu_ly,
        });

        setOpen(true);
    };

    const handleUpdate = async (status) => {
        try {
            const values = form.getFieldsValue();

            await axios.put(`/api/yeu-cau/${selected.id}`, {
                trang_thai: status,
                ghi_chu_xu_ly: values.ghi_chu_xu_ly,
            });

            message.success("Cập nhật thành công");

            setOpen(false);
            fetchData();
        } catch {
            message.error("Có lỗi xảy ra");
        }
    };

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "ma_yeu_cau",
        },
        {
            title: "Loại yêu cầu",
            dataIndex: "loai_yeu_cau",
        },
        {
            title: "Người gửi",
            dataIndex: "nguoi_gui",
        },
        {
            title: "Trạng thái",
            dataIndex: "trang_thai",
            render: (value) => {
                let color = "orange";

                if (value === "DA_DUYET")
                    color = "green";

                if (value === "TU_CHOI")
                    color = "red";

                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: "Thao tác",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleOpen(record)}
                >
                    Xử lý
                </Button>
            ),
        },
    ];

    return (
        <Card title="Xử lý yêu cầu">
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
            />

            <Modal
                title="Chi tiết yêu cầu"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={800}
            >
                {selected && (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                        >
                            <Descriptions.Item label="Mã yêu cầu">
                                {selected.ma_yeu_cau}
                            </Descriptions.Item>

                            <Descriptions.Item label="Người gửi">
                                {selected.nguoi_gui}
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại yêu cầu">
                                {selected.loai_yeu_cau}
                            </Descriptions.Item>

                            <Descriptions.Item label="Nội dung">
                                {selected.noi_dung}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày gửi">
                                {selected.ngay_gui}
                            </Descriptions.Item>
                        </Descriptions>

                        <Form
                            form={form}
                            layout="vertical"
                            style={{ marginTop: 20 }}
                        >
                            <Form.Item
                                label="Ghi chú xử lý"
                                name="ghi_chu_xu_ly"
                            >
                                <TextArea rows={5} />
                            </Form.Item>
                        </Form>

                        <Space>
                            <Button
                                danger
                                onClick={() =>
                                    handleUpdate("TU_CHOI")
                                }
                            >
                                Từ chối
                            </Button>

                            <Button
                                type="primary"
                                onClick={() =>
                                    handleUpdate("DA_DUYET")
                                }
                            >
                                Duyệt yêu cầu
                            </Button>
                        </Space>
                    </>
                )}
            </Modal>
        </Card>
    );
}