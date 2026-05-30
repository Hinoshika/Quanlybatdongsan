import { Modal, Table, Button } from "antd";
import dayjs from "dayjs";

export default function TaiSanModal({

    open,
    selected,
    taiSan,
    loading,
    onClose

}) {

    const columns = [

        {
            title: "Số thửa",
            dataIndex: "so_thua"
        },

        {
            title: "Số tờ",
            dataIndex: "so_to_ban_do"
        },

        {
            title: "Loại đất",
            dataIndex: "loai_dat"
        },

        {
            title: "Diện tích",
            dataIndex: "dien_tich",

            render: v =>
                v
                    ? Number(v).toLocaleString("vi-VN")
                    : "-"
        },

        {
            title: "Tỷ lệ",
            dataIndex: "ty_le_so_huu",

            render: v =>
                v != null
                    ? `${Number(v)}%`
                    : "-"
        },

        {
            title: "Ngày bắt đầu",
            dataIndex: "ngay_bat_dau",

            render: v =>
                v
                    ? dayjs(v).format("DD/MM/YYYY")
                    : "-"
        }
    ];

    return (

        <Modal
            title={`🏠 Tài sản của: ${selected?.ho_ten || ""}`}

            open={open}

            onCancel={onClose}

            width={1100}

            footer={[

                <Button
                    key="close"
                    onClick={onClose}
                >
                    Đóng
                </Button>
            ]}
        >

            <Table
                rowKey="id"
                dataSource={taiSan}
                loading={loading}
                columns={columns}
                pagination={false}
            />

        </Modal>
    );
}