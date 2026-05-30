import { Card, Table, Empty } from "antd";

const ResultsTable = ({
    currentTableData,
    loading,
    activeMainTab,
    handleClick
}) => {
    const columns = activeMainTab === "thuadat"
        ? [
            { title: "Số thửa", dataIndex: "so_thua" },
            { title: "Tờ bản đồ", dataIndex: "so_to_ban_do" },
            { title: "Địa chỉ", dataIndex: "dia_chi" },
            { title: "Diện tích", dataIndex: "dien_tich", render: (v) => `${v} m²` },
            { title: "Loại đất", dataIndex: "loai_dat" }
        ]
        : [
            { title: "Tên công trình", dataIndex: "ten_cong_trinh" },
            { title: "Loại công trình", dataIndex: "loai_cong_trinh" },
            { title: "Địa chỉ", dataIndex: "dia_chi" },
            { title: "Số tầng", dataIndex: "so_tang" }
        ];

    return (
        <Card
            style={{ marginTop: 20 }}
            title={`Kết quả (${currentTableData.length})`}
        >
            {currentTableData.length === 0 ? (
                <Empty description="Không có dữ liệu" />
            ) : (
                <Table
                    rowKey="id"
                    dataSource={currentTableData}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => handleClick(record, activeMainTab === "congtrinh"),
                        style: { cursor: "pointer" }
                    })}
                    columns={columns}
                />
            )}
        </Card>
    );
};

export default ResultsTable;