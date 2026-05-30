import { Table } from "antd";

export default function ThuaDatTable({
    data,
    onRowClick
}) {
    const columns = [
        { title: "Số thửa", dataIndex: "so_thua" },
        { title: "Số tờ", dataIndex: "so_to_ban_do" },
        { title: "Loại đất", dataIndex: "loai_dat" },
        { title: "Diện tích", dataIndex: "dien_tich", render: (v) => `${v} m²` },
        { title: "Trạng thái", dataIndex: "trang_thai" },
        { title: "Tỉnh", dataIndex: "tinh" },
        { title: "Địa chỉ", dataIndex: "dia_chi" }
    ];

    return (
        <Table
            style={{ marginTop: 12 }}
            rowKey={(record) => record.id}
            dataSource={Array.isArray(data) ? data : []}
            columns={columns}
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({
                onClick: () => onRowClick(record),
            })}
        />
    );
}