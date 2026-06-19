import { useEffect, useState } from "react";

import {
  Card,
  Drawer,
  Descriptions,
  Tag,
  Spin,
  Alert,
  List,
  Avatar,
  Empty,
  Tabs,
  Row,
  Col,
} from "antd";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  getAllThuaDatMap,
  getThuaDatMapByThuaDat,
} from "../../../services/thuaDatMap.service";

const { BaseLayer } = LayersControl;

export default function BanDo() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);

  const [lienKe, setLienKe] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // LOAD MAP
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getAllThuaDatMap();

      console.log("MAP DATA:", result);

      setData(result || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLICK THUA DAT
  // =========================

  const handleClick = async (item) => {
    try {
      const detail = await getThuaDatMapByThuaDat(item.id);

      console.log("DETAIL:", detail);

      setSelected(detail);

      setLienKe(detail);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // STYLE
  // =========================

  const getStyle = (feature) => {
    const status = feature.properties?.trang_thai;

    let color = "#1677ff";

    if (status === "dang_su_dung") color = "#52c41a";
    else if (status === "Tranh chấp") color = "#ff4d4f";
    else if (status === "Thu hồi") color = "#8c8c8c";

    return {
      color,

      fillColor: color,

      fillOpacity: 0.35,

      weight: 2,
    };
  };

  const renderTrangThai = (status) => {
    if (!status) return "-";

    return (
      <Tag
        color={
          status === "dang_su_dung"
            ? "green"
            : status === "tranh_chap"
              ? "red"
              : "orange"
        }
      >
        {status}
      </Tag>
    );
  };

  const renderChuSoHuu = () => {
    return (
      <List
        bordered
        dataSource={selected?.chu_so_huu || []}
        locale={{
          emptyText: "Chưa có chủ sở hữu",
        }}
        renderItem={(owner) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>👤</Avatar>}
              title={owner.ho_ten}
              description={
                <>
                  <div>CCCD: {owner.so_cccd || "-"}</div>

                  <div>Điện thoại: {owner.so_dien_thoai || "-"}</div>

                  <div>Địa chỉ: {owner.dia_chi || "-"}</div>

                  <div>
                    Tỷ lệ: <Tag color="blue">{owner.ty_le_so_huu}%</Tag>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const renderLienKeCard = (key, title) => {
    const item = lienKe?.[key];

    return (
      <Card
        size="small"
        title={title}
        style={{
          borderRadius: 12,
          height: "100%",
        }}
      >
        {item ? (
          <>
            <p>
              <b>Số thửa:</b> {item.so_thua}
            </p>

            <p>
              <b>Tờ bản đồ:</b> {item.so_to_ban_do}
            </p>

            <p>
              <b>Diện tích:</b> {item.dien_tich} m²
            </p>

            <p>
              <b>Loại đất:</b> {item.loai_dat}
            </p>

            <p>
              <b>Địa chỉ:</b> {item.dia_chi}
            </p>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có dữ liệu"
          />
        )}
      </Card>
    );
  };

  return (
    <>
      <Alert
        message="
        Click vào thửa đất để xem thông tin
        "
        type="info"
        showIcon
        style={{
          marginBottom: 12,
        }}
      />

      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <Spin spinning={loading}>
          <MapContainer
            center={[21.0285, 105.8542]}
            zoom={14}
            style={{
              height: "calc(100vh - 150px)",

              width: "100%",
            }}
          >
            <LayersControl position="topright">
              <BaseLayer checked name="🗺 Bản đồ">
                <TileLayer
                  url="
        https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        "
                />
              </BaseLayer>

              <BaseLayer name="🛰 Vệ tinh">
                <TileLayer
                  url="
        https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
        "
                />
              </BaseLayer>

              <BaseLayer name="🌍 Hybrid">
                <TileLayer
                  url="
        https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}
        "
                />
              </BaseLayer>
            </LayersControl>

            {data.map((item) => {
              if (!item.geom) return null;

              return (
                <GeoJSON
                  key={item.id}
                  data={{
                    type: "Feature",

                    geometry: item.geom,

                    properties: item,
                  }}
                  style={() => {
                    if (selected?.id === item.id) {
                      return {
                        color: "#ff0000",

                        fillColor: "#ffd666",

                        fillOpacity: 0.7,

                        weight: 4,
                      };
                    }

                    return getStyle({
                      properties: item,
                    });
                  }}
                  eventHandlers={{
                    click: () => {
                      handleClick(item);
                    },
                  }}
                />
              );
            })}
          </MapContainer>
        </Spin>
      </Card>

      <Drawer
        title={<>📍 Thửa đất {selected?.id}</>}
        open={!!selected}
        width={520}
        placement="right"
        destroyOnClose
        onClose={() => {
          setSelected(null);
          setLienKe(null);
        }}
      >
        {selected && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "📄 Thông tin",
                children: (
                  <Card bordered={false}>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Mã định danh">
                        <Tag color="blue">#{selected.id}</Tag>
                      </Descriptions.Item>

                      <Descriptions.Item label="Số thửa">
                        {selected.so_thua}
                      </Descriptions.Item>

                      <Descriptions.Item label="Tờ bản đồ">
                        {selected.so_to_ban_do}
                      </Descriptions.Item>

                      <Descriptions.Item label="Địa chỉ">
                        {selected.dia_chi}
                      </Descriptions.Item>

                      <Descriptions.Item label="Diện tích">
                        {selected.dien_tich} m²
                      </Descriptions.Item>

                      <Descriptions.Item label="Loại đất">
                        {selected.loai_dat}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ),
              },

              {
                key: "2",
                label: "👥 Chủ sở hữu",
                children: (
                  <List
                    dataSource={selected?.chu_so_huu || []}
                    locale={{
                      emptyText: "Chưa có chủ sở hữu",
                    }}
                    renderItem={(owner) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>👤</Avatar>}
                          title={owner.ho_ten}
                          description={
                            <>
                              <div>CCCD: {owner.so_cccd || "-"}</div>

                              <div>
                                Điện thoại: {owner.so_dien_thoai || "-"}
                              </div>

                              <div>Địa chỉ: {owner.dia_chi || "-"}</div>

                              <Tag color="blue">{owner.ty_le_so_huu}%</Tag>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ),
              },

              {
                key: "3",
                label: "🧭 Liền kề",
                children: (
                  <Row gutter={[12, 12]}>
                    <Col span={12}>{renderLienKeCard("bac", "⬆ Bắc")}</Col>

                    <Col span={12}>{renderLienKeCard("dong", "➡ Đông")}</Col>

                    <Col span={12}>{renderLienKeCard("tay", "⬅ Tây")}</Col>

                    <Col span={12}>{renderLienKeCard("nam", "⬇ Nam")}</Col>
                  </Row>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </>
  );
}
