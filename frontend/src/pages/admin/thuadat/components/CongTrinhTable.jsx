import { Table } from "antd";

export default function CongTrinhTable({
    detail
}) {

    return (
        <div style={{ marginTop: 16 }}>
            <h3>🏗️ Tài sản gắn liền </h3>
            <Table

                style={{ marginTop: 16 }}
                size="small"
                rowKey="id"
                pagination={false}
                dataSource={detail?.cong_trinh || []}
                columns={[
                    {
                        title: "Tên",
                        dataIndex: "ten_cong_trinh"
                    },
                    {
                        title: "Loại",
                        dataIndex: "loai_cong_trinh"
                    }
                ]}
            />
        </div>
    );
}