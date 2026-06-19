import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Tag,
  Select,
  Row,
  Col,
  Input,
  Modal,
  Collapse,
  Button,
  Space,
  Card,
} from "antd";
import dayjs from "dayjs";

import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { getSystemHistory } from "../../../services/systemHistory.service";
const { Panel } = Collapse;
export default function SystemHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    hanh_dong: null,
    doi_tuong: null,
  });
  const renderJSON = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  // ================= LOAD ONLY ONCE =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSystemHistory();
      setData(res || []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILTER LOCAL =================
  const filteredData = useMemo(() => {
    const keyword = filters.keyword.toLowerCase();

    return data.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.nguoi_sua?.toString().toLowerCase().includes(keyword) ||
        item.doi_tuong?.toLowerCase().includes(keyword) ||
        item.hanh_dong?.toLowerCase().includes(keyword);

      const matchAction =
        !filters.hanh_dong || item.hanh_dong === filters.hanh_dong;

      const matchObject =
        !filters.doi_tuong || item.doi_tuong === filters.doi_tuong;

      return matchKeyword && matchAction && matchObject;
    });
  }, [data, filters]);

  // ================= VIEW DETAIL =================
  const handleView = (record) => {
    setSelected(record);
    setOpen(true);
  };

  const actionColor = {
    CREATE: "green",
    UPDATE: "orange",
    DELETE: "red",
    LOGIN: "blue",
    TACH: "purple",
    GOP: "cyan",
  };

  const actionLabel = {
    CREATE: "Tạo mới",
    UPDATE: "Cập nhật",
    DELETE: "Xóa",
    LOGIN: "Đăng nhập",
    TACH: "Tách thửa",
    GOP: "Gộp thửa",
  };

  const objectLabel = {
    THUA_DAT: "Thửa đất",
    CONG_TRINH: "Công trình",
    CHU_SO_HUU: "Chủ sở hữu",
    USER: "Người dùng",
    YEU_CAU: "Yêu cầu",
  };

  const columns = [
    {
      title: "Người thao tác",
      dataIndex: "nguoi_sua",
      render: (v) => <b>{v || "-"}</b>,
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      align: "center",
      render: (v) => (
        <Tag color={actionColor[v] || "default"}>{actionLabel[v] || v}</Tag>
      ),
    },
    {
      title: "Đối tượng",
      dataIndex: "doi_tuong",
      render: (v) => <Tag color="geekblue">{objectLabel[v] || v}</Tag>,
    },
    {
      title: "Lý do",
      dataIndex: "ly_do",
      ellipsis: true,
      render: (v) => v || "-",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm:ss") : "-"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>📜 Lịch sử hệ thống</h2>

      {/* FILTER */}
      <Card
        size="small"
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          {/* Search */}
          <Col xs={24} md={8}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo người thao tác, hành động..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  keyword: e.target.value,
                }))
              }
            />
          </Col>

          {/* Hành động */}
          <Col xs={24} md={6}>
            <Select
              allowClear
              placeholder="Hành động"
              style={{ width: "100%" }}
              value={filters.hanh_dong}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  hanh_dong: val,
                }))
              }
              options={[
                { value: "CREATE", label: "➕ Tạo mới" },
                { value: "UPDATE", label: "✏️ Cập nhật" },
                { value: "DELETE", label: "🗑 Xóa" },
                { value: "LOGIN", label: "🔐 Đăng nhập" },
                { value: "TACH", label: "✂️ Tách thửa" },
                { value: "GOP", label: "🔗 Gộp thửa" },
              ]}
            />
          </Col>

          {/* Đối tượng */}
          <Col xs={24} md={6}>
            <Select
              allowClear
              placeholder="Đối tượng"
              style={{ width: "100%" }}
              value={filters.doi_tuong}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  doi_tuong: val,
                }))
              }
              options={[
                { value: "THUA_DAT", label: "🏡 Thửa đất" },
                { value: "CONG_TRINH", label: "🏗 Công trình" },
                { value: "CHU_SO_HUU", label: "👤 Chủ sở hữu" },
                { value: "USER", label: "👨‍💼 Người dùng" },
                { value: "YEU_CAU", label: "📄 Yêu cầu" },
              ]}
            />
          </Col>

          {/* Buttons */}
          <Col xs={24} md={4}>
            <Space style={{ width: "100%" }}>
              <Button type="primary" icon={<FilterOutlined />}>
                Lọc
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  setFilters({
                    keyword: "",
                    hanh_dong: null,
                    doi_tuong: null,
                  })
                }
              >
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <Table
        loading={loading}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        columns={columns}
        onRow={(record) => ({
          onClick: () => handleView(record),
          style: { cursor: "pointer" },
        })}
      />

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={850}
        centered
        title="📜 Chi tiết lịch sử chỉnh sửa"
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* HEADER */}
            <div style={{ display: "flex", gap: 8 }}>
              <Tag color="blue">{selected.doi_tuong}</Tag>

              <Tag color={actionColor[selected.hanh_dong] || "default"}>
                {actionLabel[selected.hanh_dong] || selected.hanh_dong}
              </Tag>
            </div>

            {/* INFO */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <b>👤 Người thao tác:</b>
                <br />
                {selected.nguoi_sua || "-"}
              </div>

              <div>
                <b>🕒 Thời gian:</b>
                <br />
                {selected.created_at
                  ? dayjs(selected.created_at).format("DD/MM/YYYY HH:mm:ss")
                  : "-"}
              </div>
            </div>

            {/* LÝ DO */}
            <div
              style={{
                padding: 12,
                background: "#f8fafc",
                borderRadius: 8,
              }}
            >
              <b>📌 Lý do</b>
              <div style={{ marginTop: 6 }}>{selected.ly_do || "Không có"}</div>
            </div>

            {/* COLLAPSE DATA */}
            <Collapse defaultActiveKey={[]}>
              {/* OLD DATA */}
              <Panel header="🔴 Dữ liệu cũ" key="1">
                <pre
                  style={{
                    fontSize: 12,
                    maxHeight: 300,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {renderJSON(selected.du_lieu_cu)}
                </pre>
              </Panel>

              {/* NEW DATA */}
              <Panel header="🟢 Dữ liệu mới" key="2">
                <pre
                  style={{
                    fontSize: 12,
                    maxHeight: 300,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {renderJSON(selected.du_lieu_moi)}
                </pre>
              </Panel>
            </Collapse>
          </div>
        )}
      </Modal>
    </div>
  );
}
