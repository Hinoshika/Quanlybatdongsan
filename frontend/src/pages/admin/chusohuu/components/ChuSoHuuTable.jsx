import { Table, Tag, Avatar, Space, Button } from "antd";
import {
    UserOutlined,
    EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function ChuSoHuuTable({ data, onEdit }) {
    const columns = [
        {
            title: "Chủ sở hữu",
            dataIndex: "ho_ten",
            width: 260,
            render: (_, record) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            background: "#1677ff",
                        }}
                    />

                    <div>
                        <div
                            style={{
                                fontWeight: 600,
                                color: "#1e293b",
                            }}
                        >
                            {record.ho_ten}
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color: "#94a3b8",
                            }}
                        >
                            CCCD: {record.so_cccd}
                        </div>
                    </div>
                </Space>
            ),
        },

        {
            title: "Số điện thoại",
            dataIndex: "so_dien_thoai",
            width: 150,
        },

        {
            title: "Loại chủ",
            dataIndex: "loai",
            width: 140,
            render: (value) => (
                <Tag
                    color={
                        value === "Cá nhân"
                            ? "blue"
                            : "gold"
                    }
                    style={{
                        borderRadius: 20,
                        padding: "2px 12px",
                    }}
                >
                    {value}
                </Tag>
            ),
        },

        {
            title: "Ngày sinh",
            dataIndex: "ngay_sinh",
            width: 130,
            render: (value) =>
                value
                    ? dayjs(value).format("DD/MM/YYYY")
                    : "-",
        },

        {
            title: "Địa chỉ",
            dataIndex: "dia_chi",
            ellipsis: true,
            render: (value) => (
                <span
                    style={{
                        color: "#64748b",
                    }}
                >
                    {value || "-"}
                </span>
            ),
        },

        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(record)}
                >
                    Sửa
                </Button>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) =>
                    `Tổng ${total} chủ sở hữu`,
            }}
            rowClassName={() => "owner-row"}
            style={{
                background: "#fff",
                borderRadius: 16,
            }}
        />
    );
}