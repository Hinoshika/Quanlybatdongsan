import { Table, Button } from "antd";

export default function ChuSoHuuTable({
    detail,
    onOpenTransfer
}) {

    const dataSource = detail?.chu_so_huu || [];

    return (
        <div style={{ marginTop: 16 }}>

            <h3>👤 Chủ sở hữu</h3>

            <Table
                size="small"
                bordered
                pagination={false}
                rowKey="id"
                dataSource={dataSource}
                columns={[
                    {
                        title: "Họ tên",
                        dataIndex: "ho_ten"
                    },
                    {
                        title: "CCCD",
                        dataIndex: "so_cccd"
                    },
                    {
                        title: "Tỷ lệ sở hữu",
                        dataIndex: "ty_le_so_huu",
                        render: (v) => `${v}%`
                    },
                    {
                        title: "🔄 Mua bán / Chuyển nhượng",
                        render: (_, record) => (
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => onOpenTransfer(record)}
                            >
                                🔄 Chuyển nhượng
                            </Button>
                        )
                    }
                ]}
            />

        </div>
    );
}