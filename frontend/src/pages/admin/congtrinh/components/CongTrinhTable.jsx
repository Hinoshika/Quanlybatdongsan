import { Table, Button } from "antd";

export default function CongTrinhTable({
    data,
    onEdit
}) {

    const columns = [
        { title: "Tên công trình", dataIndex: "ten_cong_trinh" },
        { title: "Loại công trình", dataIndex: "loai_cong_trinh" },
        { title: "Diện tích xây dựng", dataIndex: "dien_tich_xay_dung", render: (v) => `${v} m²` },
        { title: "Địa chỉ", dataIndex: "dia_chi" },
        { title: "Trạng thái", dataIndex: "trang_thai" }
    ];

    return (
        <div style={{ padding: 24 }}>

            <Table
                style={{ marginTop: 12 }}
                rowKey="id"
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 6 }}
                onRow={(r) => ({
                    onClick: () => onEdit(r)
                })}
            />
        </div>
    );
}