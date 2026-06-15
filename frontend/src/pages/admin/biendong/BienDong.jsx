import { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Modal,
    DatePicker,
    Select,
    InputNumber,
    Row,
    Col,
    Button
} from "antd";
import dayjs from "dayjs";

import {
    getBienDong,
    getBienDongById
} from "../../../services/bienDong.service";

const { RangePicker } = DatePicker;

// ================== MAP LABEL LOẠI BIẾN ĐỘNG ==================
const getLoaiLabel = (v) => {
    switch (v) {
        case "CHUYEN_NHUONG": return "Chuyển nhượng";
        case "CAP_NHAT": return "Cập nhật";
        case "TAO_MOI": return "Tạo mới";
        case "XOA": return "Xóa";
        case "TACH_THUA": return "Tách thửa";
        case "GOP_THUA": return "Gộp thửa";
        case "THAY_DOI_CHU_SO_HUU": return "Thay đổi chủ sở hữu";
        case "THAY_DOI_CONG_TRINH": return "Thay đổi công trình";
        default: return v;
    }
};

const getColor = (v) => {
    switch (v) {
        case "CHUYEN_NHUONG": return "red";
        case "CAP_NHAT": return "orange";
        case "TAO_MOI": return "green";
        case "XOA": return "gray";
        case "TACH_THUA": return "blue";
        case "GOP_THUA": return "purple";
        default: return "default";
    }
};

export default function BienDong() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState(null);
    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState({
        date: null,
        type: null,
        minValue: null,
        maxValue: null
    });

    // ================== LOAD DATA ==================
    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const res = await getBienDong(params);
            setData(res.data || []);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================== VIEW DETAIL ==================
    const handleView = async (id) => {
        try {
            const res = await getBienDongById(id);
            setDetail(res.data);
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    // ================== FILTER ==================
    const handleFilter = () => {
        const params = {};

        if (filters.type) {
            params.loai_bien_dong = filters.type;
        }

        if (filters.date?.length === 2) {
            params.from_date = filters.date[0].format("YYYY-MM-DD");
            params.to_date = filters.date[1].format("YYYY-MM-DD");
        }

        if (filters.minValue != null) params.min_gia_tri = filters.minValue;
        if (filters.maxValue != null) params.max_gia_tri = filters.maxValue;

        fetchData(params);
    };

    const handleReset = () => {
        setFilters({
            date: null,
            type: null,
            minValue: null,
            maxValue: null
        });
        fetchData();
    };

    // ================== TABLE ==================
    const columns = [
        {
            title: "Ngày",
            dataIndex: "ngay_bien_dong",
            render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "-"
        },
        {
            title: "Loại",
            dataIndex: "loai_bien_dong",
            render: (v) => (
                <Tag color={getColor(v)}>
                    {getLoaiLabel(v)}
                </Tag>
            )
        },
        {
            title: "Thửa đất",
            render: (_, r) =>
                r.so_thua
                    ? `Thửa ${r.so_thua} - Tờ ${r.so_to_ban_do}`
                    : "-"
        },
        {
            title: "Công trình",
            dataIndex: "ten_cong_trinh",
            render: (v) => v || "-"
        },
        {
            title: "Người tạo",
            dataIndex: "nguoi_tao",
            render: (v) => v || "-"
        }
    ];

    return (
        <div style={{ padding: 16 }}>

            <h2>📊 Danh sách biến động</h2>

            {/* FILTER */}
            <Row gutter={12} style={{ marginBottom: 16 }}>

                <Col>
                    <RangePicker
                        value={filters.date}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, date: val }))
                        }
                    />
                </Col>

                <Col>
                    <Select
                        placeholder="Loại biến động"
                        allowClear
                        style={{ width: 200 }}
                        value={filters.type}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, type: val }))
                        }
                    >
                        <Select.Option value="CHUYEN_NHUONG">Chuyển nhượng</Select.Option>
                        <Select.Option value="TAO_MOI">Tạo mới</Select.Option>
                        <Select.Option value="CAP_NHAT">Cập nhật</Select.Option>
                        <Select.Option value="TACH_THUA">Tách thửa</Select.Option>
                        <Select.Option value="GOP_THUA">Gộp thửa</Select.Option>
                    </Select>
                </Col>

                <Col>
                    <InputNumber
                        placeholder="Giá trị từ"
                        value={filters.minValue}
                        onChange={(v) =>
                            setFilters(p => ({ ...p, minValue: v }))
                        }
                    />
                </Col>

                <Col>
                    <InputNumber
                        placeholder="Giá trị đến"
                        value={filters.maxValue}
                        onChange={(v) =>
                            setFilters(p => ({ ...p, maxValue: v }))
                        }
                    />
                </Col>

                <Col>
                    <Button type="primary" onClick={handleFilter}>
                        Lọc
                    </Button>
                </Col>

                <Col>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </Col>

            </Row>

            {/* TABLE */}
            <Table
                loading={loading}
                dataSource={data}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleView(record.id),
                    style: { cursor: "pointer" }
                })}
            />

            {/* DETAIL MODAL */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={950}
                centered
                title="📊 Chi tiết biến động tài sản"
                styles={{
                    body: { padding: 20 }
                }}
            >
                {detail && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* HEADER BADGE */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Tag
                                style={{ fontSize: 13, padding: "4px 10px" }}
                                color={getColor(detail.loai_bien_dong)}
                            >
                                {getLoaiLabel(detail.loai_bien_dong)}
                            </Tag>

                            <span style={{ fontSize: 12, color: "#64748b" }}>
                                ID: #{detail.id}
                            </span>
                        </div>

                        {/* INFO CARDS */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 12
                        }}>

                            <div style={cardStyle}>
                                <div style={labelStyle}>📅 Ngày biến động</div>
                                <div style={valueStyle}>
                                    {detail.ngay_bien_dong
                                        ? dayjs(detail.ngay_bien_dong).format("DD/MM/YYYY")
                                        : "-"}
                                </div>
                            </div>

                            <div style={cardStyle}>
                                <div style={labelStyle}>💰 Giá trị</div>
                                <div style={valueStyle}>
                                    {detail.gia_tri_giao_dich
                                        ? Number(detail.gia_tri_giao_dich).toLocaleString("vi-VN") + " đ"
                                        : "-"}
                                </div>
                            </div>

                            <div style={cardStyle}>
                                <div style={labelStyle}>👤 Người tạo</div>
                                <div style={valueStyle}>
                                    {detail.nguoi_tao || "-"}
                                </div>
                            </div>

                        </div>

                        {/* THỬA ĐẤT */}
                        <div style={sectionCard}>
                            <div style={sectionTitle}>🏡 Thửa đất</div>
                            <div style={sectionValue}>
                                {detail.so_thua
                                    ? `Thửa ${detail.so_thua} • Tờ ${detail.so_to_ban_do}`
                                    : "Không có thông tin"}
                            </div>
                        </div>

                        {/* CÔNG TRÌNH */}
                        <div style={sectionCard}>
                            <div style={sectionTitle}>🏗 Công trình</div>
                            <div style={sectionValue}>
                                {detail.ten_cong_trinh || "Không có"}
                            </div>
                        </div>

                        {/* CHỦ SỞ HỮU */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                            <div style={{
                                ...ownerCard,
                                borderLeft: "4px solid #ef4444"
                            }}>
                                <div style={{ fontWeight: 600, color: "#ef4444" }}>
                                    👈 Chủ cũ
                                </div>
                                <div style={{ marginTop: 6, fontSize: 15 }}>
                                    {detail.chu_so_huu_cu || "-"}
                                </div>
                            </div>

                            <div style={{
                                ...ownerCard,
                                borderLeft: "4px solid #22c55e"
                            }}>
                                <div style={{ fontWeight: 600, color: "#22c55e" }}>
                                    👉 Chủ mới
                                </div>
                                <div style={{ marginTop: 6, fontSize: 15 }}>
                                    {detail.chu_so_huu_moi || "-"}
                                </div>
                            </div>

                        </div>

                        {/* NỘI DUNG */}
                        <div style={{
                            background: "#0c9acd",
                            color: "#e2e8f0",
                            padding: 14,
                            borderRadius: 10
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                📝 Nội dung biến động
                            </div>
                            <div style={{ lineHeight: 1.6 }}>
                                {detail.noi_dung || "Không có mô tả"}
                            </div>
                        </div>

                    </div>
                )}
            </Modal>
        </div>
    );
}// ================= STYLE UI MODAL =================
const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 12,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)"
};

const labelStyle = {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4
};

const valueStyle = {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a"
};

const sectionCard = {
    background: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    border: "1px solid #e2e8f0"
};

const sectionTitle = {
    fontWeight: 600,
    marginBottom: 6,
    color: "#0f172a"
};

const sectionValue = {
    fontSize: 15,
    color: "#334155"
};

const ownerCard = {
    background: "#ffffff",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #e2e8f0"
};