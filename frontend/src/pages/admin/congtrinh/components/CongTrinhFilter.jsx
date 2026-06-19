import { Input, Select, Button, Card, Row, Col, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function CongTrinhFilter({
  filters,
  setFilters,
  onSearch,
  onReset,
}) {
  const [local, setLocal] = useState(filters);

  const handleChange = (key, value) => {
    const updated = {
      ...local,
      [key]: value,
    };

    setLocal(updated);
    setFilters(updated);
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Row gutter={[12, 12]}>
        {/* Hàng 1 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="🔎 Mã định danh"
            value={local.id}
            onChange={(e) => handleChange("id", e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="🪪 CCCD chủ sở hữu"
            value={local.so_cccd}
            onChange={(e) => handleChange("so_cccd", e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="🏗 Loại công trình"
            value={local.loai_cong_trinh}
            onChange={(v) => handleChange("loai_cong_trinh", v)}
            allowClear
            options={[
              {
                value: "Công trình dân dụng",
                label: "Công trình dân dụng",
              },
              {
                value: "Công trình công nghiệp",
                label: "Công trình công nghiệp",
              },
              {
                value: "Công trình giao thông",
                label: "Công trình giao thông",
              },
              {
                value: "Công trình nông nghiệp và phát triển nông thôn",
                label: "Công trình nông nghiệp và phát triển nông thôn",
              },
              {
                value: "Công trình thủy lợi",
                label: "Công trình thủy lợi",
              },
              {
                value: "Công trình văn hóa, thể thao và du lịch",
                label: "Công trình văn hóa, thể thao và du lịch",
              },
              {
                value: "Công trình y tế và giáo dục",
                label: "Công trình y tế và giáo dục",
              },
              {
                value: "Công trình công cộng khác",
                label: "Công trình công cộng khác",
              },
            ]}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="📌 Trạng thái"
            value={local.trang_thai}
            onChange={(v) => handleChange("trang_thai", v)}
            allowClear
            options={[
              {
                value: "Đang sử dụng",
                label: "Đang sử dụng",
              },
              {
                value: "Chưa hoàn thành",
                label: "Chưa hoàn thành",
              },
              {
                value: "Thu hồi",
                label: "Thu hồi",
              },
            ]}
          />
        </Col>

        {/* Hàng 2 */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Input
            placeholder="📐 DT tối thiểu"
            value={local.dien_tich_min}
            onChange={(e) => handleChange("dien_tich_min", e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Input
            placeholder="📐 DT tối đa"
            value={local.dien_tich_max}
            onChange={(e) => handleChange("dien_tich_max", e.target.value)}
          />
        </Col>

        <Col xs={24} lg={8}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              Tìm kiếm
            </Button>

            <Button icon={<ReloadOutlined />} onClick={onReset}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
