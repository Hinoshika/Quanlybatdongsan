import { Table } from "antd";

export default function ResultTable({ data, onSelect }) {

    const columns = [
        {
            title: "Số thửa",
            dataIndex: "so_thua"
        },
        {
            title: "Tờ bản đồ",
            dataIndex: "so_to_ban_do"
        },
        {
            title: "Chủ sở hữu",
            dataIndex: "chu_so_huu"
        }
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            onRow={(record) => ({
                onClick: () => onSelect(record)
            })}
        />
    );
}