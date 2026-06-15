import { Modal, Table, Button, Tag, Typography, Divider } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export default function TaiSanModal({
    open,
    selected,
    taiSan,
    loading,
    onClose
}) {

    const datColumns = [
        {
            title: "Số thửa",
            dataIndex: "so_thua",
            width: 100
        },
        {
            title: "Số tờ",
            dataIndex: "so_to_ban_do",
            width: 100
        },
        {
            title: "Loại đất",
            dataIndex: "loai_dat",
            render: v => <Tag color="green">{v || "-"}</Tag>
        },
        {
            title: "Diện tích",
            dataIndex: "dien_tich",
            render: v => v ? Number(v).toLocaleString("vi-VN") : "-"
        },
        {
            title: "Tỷ lệ sở hữu",
            dataIndex: "ty_le_so_huu_dat",
            render: v => v != null ? <Tag color="blue">{v}%</Tag> : "-"
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "ngay_bat_dau_dat",
            render: v => v ? dayjs(v).format("DD/MM/YYYY") : "-"
        }
    ];

    const congTrinhColumns = [
        {
            title: "Tên công trình",
            dataIndex: "ten_cong_trinh"
        },
        {
            title: "Loại",
            dataIndex: "loai_cong_trinh",
            render: v => <Tag color="purple">{v || "-"}</Tag>
        },
        {
            title: "Diện tích xây dựng",
            dataIndex: "dien_tich_xay_dung",
            render: v => v ? `${Number(v).toLocaleString("vi-VN")} m²` : "-"
        },
        {
            title: "Tỷ lệ sở hữu",
            dataIndex: "ty_le_so_huu",
            render: v => v != null ? `${v}%` : "-"
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "ngay_bat_dau",
            render: v => v ? dayjs(v).format("DD/MM/YYYY") : "-"
        }
    ];

    return (
        <Modal
            title={`🏠 Tài sản của: ${selected?.ho_ten || ""}`}
            open={open}
            onCancel={onClose}
            width={1200}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
        >

            {/* 🟢 THỬA ĐẤT */}
            <Title level={5} style={{ marginTop: 0 }}>
                🟢 Thửa đất
            </Title>

            <Table
                rowKey="id"
                dataSource={taiSan}
                loading={loading}
                columns={datColumns}
                pagination={false}
                size="small"
            />

            <Divider />

            {/* 🟣 CÔNG TRÌNH */}
            <Title level={5}>
                🟣 Công trình
            </Title>

            <Table
                rowKey="id"
                loading={loading}
                columns={congTrinhColumns}
                pagination={false}
                size="small"
                dataSource={
                    taiSan?.flatMap(item => item.cong_trinh || [])
                }
            />

        </Modal>
    );
}