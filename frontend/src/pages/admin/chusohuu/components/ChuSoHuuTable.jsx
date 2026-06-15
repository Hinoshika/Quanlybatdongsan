import { Table } from "antd";
import dayjs from "dayjs";

export default function ChuSoHuuTable({
    data,
    onEdit
}) {

    const columns = [

        {
            title: "Họ tên",
            dataIndex: "ho_ten"
        },

        {
            title: "CCCD / Mã số thuế",
            dataIndex: "so_cccd"
        },

        {
            title: "SĐT",
            dataIndex: "so_dien_thoai"
        },

        {
            title: "Loại",
            dataIndex: "loai"
        },

        {
            title: "Ngày sinh",
            dataIndex: "ngay_sinh",

            render: v =>
                v
                    ? dayjs(v).format("DD/MM/YYYY")
                    : "-"
        },

        {
            title: "Địa chỉ",
            dataIndex: "dia_chi"
        }
    ];

    return (

        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            pagination={{
                pageSize: 6
            }}
            onRow={(record) => ({
                onClick: () => onEdit(record)
            })}
        />
    );
}