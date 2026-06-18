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
    Image,
    Typography
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
    const { Text, Link } = Typography;
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const result = await getYeuCau();

            setData(result || []);

            if (selected) {
                const current = result.find(
                    item => item.id === selected.id
                );

                if (current) {
                    setSelected(current);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000); // 5 giây

        return () => {
            clearInterval(interval);
        };
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
    ];
    return (
        <>
            <Card title="Danh sách yêu cầu">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        pageSize: 10
                    }}
                    onRow={(record) => ({
                        onClick: () => handleOpen(record),
                        style: {
                            cursor: "pointer"
                        }
                    })}
                />
            </Card>

            <Modal
                title="Chi tiết yêu cầu"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setSelected(null);
                }}
                width={900}
                footer={null}
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

                            <Descriptions.Item label="Ngày gửi">
                                {selected.ngay_gui
                                    ? new Date(
                                        selected.ngay_gui
                                    ).toLocaleString("vi-VN")
                                    : ""}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {renderStatus(
                                    selected.trang_thai
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                        <Card
                            title="Nội dung yêu cầu"
                            style={{
                                marginTop: 16
                            }}
                        >
                            {selected.noi_dung ||
                                "Không có nội dung"}
                        </Card>

                        <Card
                            title="Tệp đính kèm"
                            style={{
                                marginTop: 16
                            }}
                        >
                            {selected.tep_dinh_kem?.length >
                                0 ? (
                                <Space
                                    direction="vertical"
                                    style={{
                                        width: "100%"
                                    }}
                                >
                                    {selected.tep_dinh_kem.map(
                                        (
                                            file,
                                            index
                                        ) => {
                                            const fileUrl =
                                                `http://localhost:5000/${file.duong_dan}`;

                                            const isImage =
                                                file.loai_file?.startsWith(
                                                    "image/"
                                                );

                                            return (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                >
                                                    {isImage && (
                                                        <>
                                                            <Image
                                                                width={
                                                                    250
                                                                }
                                                                src={
                                                                    fileUrl
                                                                }
                                                            />
                                                            <br />
                                                        </>
                                                    )}

                                                    <Link
                                                        href={
                                                            fileUrl
                                                        }
                                                        target="_blank"
                                                    >
                                                        {
                                                            file.ten_file
                                                        }
                                                    </Link>
                                                </div>
                                            );
                                        }
                                    )}
                                </Space>
                            ) : (
                                <Text type="secondary">
                                    Không có tệp đính kèm
                                </Text>
                            )}
                        </Card>

                        <Form
                            form={form}
                            layout="vertical"
                            style={{
                                marginTop: 16
                            }}
                        >
                            <Form.Item
                                label="Phản hồi xử lý"
                                name="ghi_chu_xu_ly"
                            >
                                <TextArea
                                    rows={4}
                                />
                            </Form.Item>
                        </Form>

                        {selected.trang_thai ===
                            "CHO_XU_LY" && (
                                <Space
                                    style={{
                                        marginTop: 16
                                    }}
                                >
                                    <Popconfirm
                                        title="Duyệt yêu cầu?"
                                        onConfirm={() =>
                                            handleUpdate(
                                                "DA_DUYET"
                                            )
                                        }
                                    >
                                        <Button type="primary">
                                            Duyệt
                                        </Button>
                                    </Popconfirm>

                                    <Popconfirm
                                        title="Từ chối yêu cầu?"
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
                                </Space>
                            )}
                    </>
                )}
            </Modal>
        </>
    );
}