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
  Button,
  Card,
} from "antd";
import dayjs from "dayjs";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getBienDong,
  getBienDongById,
} from "../../../services/bienDong.service";

const { RangePicker } = DatePicker;

// ================== MAP LABEL LOẠI BIẾN ĐỘNG ==================
const getLoaiLabel = (v) => {
  switch (v) {
    // Nhóm giao dịch
    case "Chuyển nhượng":
      return "Chuyển nhượng";
    case "Mua bán":
      return "Mua bán";
    case "Tặng cho":
      return "Tặng cho";
    case "Thừa kế":
      return "Thừa kế";
    case "Cho thuê":
      return "Cho thuê";
    case "Thuê mua":
      return "Thuê mua";
    case "Thế chấp":
      return "Thế chấp";
    case "Góp vốn":
      return "Góp vốn";

    // Nhóm kỹ thuật, địa chính và quản trị
    case "Tạo mới":
      return "Tạo mới";
    case "Cập nhật":
      return "Cập nhật";
    case "Xóa":
      return "Xóa";
    case "Tách thửa":
      return "Tách thửa";
    case "Gộp thửa":
      return "Gộp thửa";
    case "Thay đổi chủ sở hữu":
      return "Thay đổi chủ sở hữu";
    case "Thay đổi công trình":
      return "Thay đổi công trình";
    case "Chuyển mục đích":
      return "Chuyển mục đích sử dụng";
    case "Gia hạn":
      return "Gia hạn sử dụng";
    case "Đính chính":
      return "Đính chính sai sót";
    case "Thu hồi":
      return "Thu hồi đất";
    default:
      return v;
  }
};

const getColor = (v) => {
  switch (v) {
    // Nhóm giao dịch (Màu nổi bật, ấm)
    case "Chuyển nhượng":
      return "red";
    case "Mua bán":
      return "volcano";
    case "Tặng cho":
      return "green";
    case "Thừa kế":
      return "gold";
    case "Cho thuê":
      return "cyan";
    case "Thuê mua":
      return "geekblue";
    case "Thế chấp":
      return "purple";
    case "Góp vốn":
      return "magenta";

    // Nhóm kỹ thuật (Màu lạnh, trung tính)
    case "Tạo mới":
      return "lime";
    case "Cập nhật":
      return "blue";
    case "Xóa":
    case "Thu hồi":
      return "error";
    case "Tách thửa":
      return "orange";
    case "Gộp thửa":
      return "pink";
    case "Thay đổi chủ sở hữu":
    case "Thay đổi công trình":
    case "Chuyển mục đích":
    case "Gia hạn":
    case "Đính chính":
      return "processing";
    default:
      return "default";
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
    maxValue: null,
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
      maxValue: null,
    });
    fetchData();
  };

  // ================== TABLE ==================
  const columns = [
    {
      title: "Ngày",
      dataIndex: "ngay_bien_dong",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
    },

    {
      title: "Loại",
      dataIndex: "loai_bien_dong",
      render: (v) => <Tag color={getColor(v)}>{getLoaiLabel(v)}</Tag>,
    },

    {
      title: "Thửa đất",
      render: (_, r) =>
        r.thua_dat_id
          ? `Thửa ${r.so_thua} - Tờ ${r.so_to_ban_do} - ${r.dia_chi}`
          : "-",
    },

    {
      title: "Công trình",
      render: (_, r) => (r.cong_trinh_id ? `${r.ten_cong_trinh}` : "-"),
    },

    {
      title: "Người tạo",
      dataIndex: "nguoi_tao",
      render: (v) => v || "-",
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>📊 Danh sách biến động</h2>

      {/* FILTER */}
      {/* ================= FILTER ================= */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 12,
        }}
        title={
          <span>
            <FilterOutlined /> Bộ lọc biến động
          </span>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Làm mới
          </Button>
        }
      >
        <Row gutter={[16, 8]} align="bottom">
          {/* DATE */}
          <Col xs={24} md={8} lg={6}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>
              Ngày biến động
            </div>

            <RangePicker
              style={{ width: "100%" }}
              value={filters.date}
              onChange={(val) =>
                setFilters((p) => ({
                  ...p,
                  date: val,
                }))
              }
            />
          </Col>

          {/* TYPE */}
          <Col xs={24} md={8} lg={6}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>
              Loại biến động
            </div>

            <Select
              allowClear
              placeholder="Chọn loại biến động"
              style={{ width: "100%" }}
              value={filters.type}
              onChange={(val) =>
                setFilters((p) => ({
                  ...p,
                  type: val,
                }))
              }
            >
              <Select.Option value="Chuyển nhượng">
                🔄 Chuyển nhượng
              </Select.Option>

              <Select.Option value="Mua bán">💰 Mua bán</Select.Option>

              <Select.Option value="Tặng cho">🎁 Tặng cho</Select.Option>

              <Select.Option value="Thừa kế">📜 Thừa kế</Select.Option>

              <Select.Option value="Cho thuê">🏢 Cho thuê</Select.Option>

              <Select.Option value="Thuê mua">🔑 Thuê mua</Select.Option>

              <Select.Option value="Thế chấp">🏦 Thế chấp</Select.Option>

              <Select.Option value="Tạo mới">✨ Tạo mới</Select.Option>

              <Select.Option value="Cập nhật">📝 Cập nhật</Select.Option>

              <Select.Option value="Tách thửa">✂️ Tách thửa</Select.Option>

              <Select.Option value="Gộp thửa">🗺 Gộp thửa</Select.Option>

              <Select.Option value="Thu hồi">❌ Thu hồi</Select.Option>
            </Select>
          </Col>

          {/* MIN */}
          <Col xs={12} md={4} lg={3}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Giá trị từ</div>

            <InputNumber
              style={{ width: "100%" }}
              placeholder="VNĐ"
              min={0}
              value={filters.minValue}
              onChange={(v) =>
                setFilters((p) => ({
                  ...p,
                  minValue: v,
                }))
              }
            />
          </Col>

          {/* MAX */}
          <Col xs={12} md={4} lg={3}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Giá trị đến</div>

            <InputNumber
              style={{ width: "100%" }}
              placeholder="VNĐ"
              min={0}
              value={filters.maxValue}
              onChange={(v) =>
                setFilters((p) => ({
                  ...p,
                  maxValue: v,
                }))
              }
            />
          </Col>

          {/* SEARCH */}
          <Col xs={24} lg={6}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="middle"
              onClick={handleFilter}
              block
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleView(record.id),
          style: { cursor: "pointer" },
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
          body: { padding: 20 },
        }}
      >
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* HEADER BADGE */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
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
                    ? Number(detail.gia_tri_giao_dich).toLocaleString("vi-VN") +
                      " đ"
                    : "-"}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={labelStyle}>👤 Người tạo</div>
                <div style={valueStyle}>{detail.nguoi_tao || "-"}</div>
              </div>
            </div>

            {/* THỬA ĐẤT */}
            <div style={sectionCard}>
              <div style={sectionTitle}>🏡 Thửa đất</div>

              <div style={sectionValue}>
                {detail.thua_dat_id && (
                  <div>
                    <b>Mã Định Danh:</b> #{detail.thua_dat_id}
                  </div>
                )}

                {detail.so_thua
                  ? `Thửa ${detail.so_thua} • Tờ ${detail.so_to_ban_do} • Địa Chỉ ${detail.dia_chi}`
                  : "Không có thông tin"}
              </div>
            </div>

            {/* CÔNG TRÌNH */}
            <div style={sectionCard}>
              <div style={sectionTitle}>🏗 Công trình</div>

              <div style={sectionValue}>
                {detail.cong_trinh_id && (
                  <div>
                    <b>Mã Định Danh:</b> #{detail.cong_trinh_id}
                  </div>
                )}

                <div>{detail.ten_cong_trinh || "Không có"}</div>
              </div>
            </div>

            {/* CHỦ SỞ HỮU */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  ...ownerCard,
                  borderLeft: "4px solid #ef4444",
                }}
              >
                <div style={{ fontWeight: 600, color: "#ef4444" }}>
                  👈 Chủ cũ
                </div>
                <div style={{ marginTop: 6, fontSize: 15 }}>
                  {detail.chu_so_huu_cu || "-"}
                </div>
              </div>

              <div
                style={{
                  ...ownerCard,
                  borderLeft: "4px solid #22c55e",
                }}
              >
                <div style={{ fontWeight: 600, color: "#22c55e" }}>
                  👉 Chủ mới
                </div>
                <div style={{ marginTop: 6, fontSize: 15 }}>
                  {detail.chu_so_huu_moi || "-"}
                </div>
              </div>
            </div>

            {/* NỘI DUNG */}
            <div
              style={{
                background: "#0c9acd",
                color: "#e2e8f0",
                padding: 14,
                borderRadius: 10,
              }}
            >
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
} // ================= STYLE UI MODAL =================
const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: 12,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
};

const labelStyle = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 4,
};

const valueStyle = {
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a",
};

const sectionCard = {
  background: "#f8fafc",
  borderRadius: 10,
  padding: 12,
  border: "1px solid #e2e8f0",
};

const sectionTitle = {
  fontWeight: 600,
  marginBottom: 6,
  color: "#0f172a",
};

const sectionValue = {
  fontSize: 15,
  color: "#334155",
};

const ownerCard = {
  background: "#ffffff",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
};
