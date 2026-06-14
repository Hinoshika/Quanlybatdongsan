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
    Popconfirm,
} from "antd";

import {
    getYeuCau,
    approveYeuCau,
    rejectYeuCau,
} from "../../../services/yeucau.service";

export default function XuLyYeuCau() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            setLoading(true);

            const result = await getYeuCau();

            setData(result || []);
        } catch (error) {
            message.error(
                error.message || "Không tải được dữ liệu"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (record) => {
        setSelected(record);

        form.setFieldsValue({
            ghi_chu_xu_ly: record.ghi_chu_xu_ly || "",
        });

        setOpen(true);
    };

    const handleUpdate = async (status) => {
        try {
            const values = form.getFieldsValue();

            if (status === "DA_DUYET") {
                await approveYeuCau(
                    selected.id,
                    values.ghi_chu_xu_ly
                );
            } else {
                await rejectYeuCau(
                    selected.id,
                    values.ghi_chu_xu_ly
                );
            }

            message.success("Cập nhật thành công");

            setOpen(false);
            setSelected(null);

            fetchData();
        } catch (error) {
            message.error(
                error.message || "Có lỗi xảy ra"
            );
        }
    };

    const renderStatus = (value) => {
        switch (value) {
            case "DA_DUYET":
                return (
                    <Tag color="green">
                        Đã duyệt
                    </Tag>
                );

            case "TU_CHOI":
                return (
                    <Tag color="red">
                        Từ chối
                    </Tag>
                );

            default:
                return (
                    <Tag color="orange">
                        Chờ xử lý
                    </Tag>
                );
        }
    };

    const columns = [
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
            render: renderStatus,
        },
        {
            title: "Ngày gửi",
            dataIndex: "ngay_gui",
            render: (value) =>
                value
                    ? new Date(value).toLocaleString(
                        "vi-VN"
                    )
                    : "",
        },
        {
            title: "Thao tác",
            width: 120,
            render: (_, record) => (
                <Button
                    type="primary"
                    disabled={
                        record.trang_thai !==
                        "CHO_XU_LY"
                    }
                    onClick={() =>
                        handleOpen(record)
                    }
                >
                    Xử lý
                </Button>
            ),
        },
    ];

    return (
        <Card title="Danh sách yêu cầu">
            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 10,
                }}
            />

            <Modal
                title="Chi tiết yêu cầu"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setSelected(null);
                }}
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
                                {selected.ngay_gui
                                    ? new Date(
                                        selected.ngay_gui
                                    ).toLocaleString(
                                        "vi-VN"
                                    )
                                    : ""}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {renderStatus(
                                    selected.trang_thai
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                        <Form
                            form={form}
                            layout="vertical"
                            style={{
                                marginTop: 20,
                            }}
                        >
                            <Form.Item
                                label="Ghi chú xử lý"
                                name="ghi_chu_xu_ly"
                            >
                                <TextArea rows={5} />
                            </Form.Item>
                        </Form>

                        <Space>
                            <Popconfirm
                                title="Bạn có chắc muốn từ chối yêu cầu này?"
                                okText="Đồng ý"
                                cancelText="Hủy"
                                onConfirm={() =>
                                    handleUpdate(
                                        "TU_CHOI"
                                    )
                                }
                            >
                                <Button danger>
                                    Từ chối
                                </Button>
                            </Popconfirm>

                            <Popconfirm
                                title="Bạn có chắc muốn duyệt yêu cầu này?"
                                okText="Đồng ý"
                                cancelText="Hủy"
                                onConfirm={() =>
                                    handleUpdate(
                                        "DA_DUYET"
                                    )
                                }
                            >
                                <Button type="primary">
                                    Duyệt yêu cầu
                                </Button>
                            </Popconfirm>
                        </Space>
                    </>
                )}
            </Modal>
        </Card>
    );
}