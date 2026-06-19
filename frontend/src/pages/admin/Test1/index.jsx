import { useEffect, useState } from "react";

import {
  Card,
  Modal,
  Descriptions,
  Tag,
  Spin,
  Alert,
  List,
  Avatar,
  Input,
  Button,
  message,
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

  const [soCccdMoi, setSoCccdMoi] = useState("");

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

      message.error("Không lấy được dữ liệu");
    }
  };

  const reloadDetail = async () => {
    if (!selected?.id) return;

    const detail = await getThuaDatMapByThuaDat(selected.id);

    setSelected(detail);

    setLienKe(detail);
  };
  const themChuSoHuu = async () => {
    if (!soCccdMoi.trim()) {
      message.warning("Nhập CCCD");

      return;
    }

    if (!selected?.id) {
      message.warning("Chưa chọn thửa đất");

      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/thua-dat-map",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            thua_dat_id: selected.id,

            so_cccd: soCccdMoi,

            ty_le_so_huu: 100,
          }),
        },
      );

      const result = await res.json();

      console.log("ADD OWNER:", result);

      if (result.success) {
        message.success("Thêm chủ sở hữu thành công");

        setSoCccdMoi("");

        await reloadDetail();
      } else {
        message.error(result.message || "Không thêm được");
      }
    } catch (err) {
      console.log(err);

      message.error("Lỗi server");
    }
  };

  // =========================
  // STYLE
  // =========================

  const getStyle = (feature) => {
    const status = feature.properties?.trang_thai;

    let color = "#1677ff";

    if (status === "dang_su_dung") color = "#52c41a";
    else if (status === "tranh_chap") color = "#ff4d4f";
    else if (status === "thu_hoi") color = "#8c8c8c";

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

  const renderLienKe = (key, label) => {
    const item = lienKe?.[key];

    return (
      <Descriptions
        bordered
        column={2}
        style={{
          marginBottom: 15,
        }}
      >
        <Descriptions.Item label="Hướng">{label}</Descriptions.Item>

        <Descriptions.Item label="Số thửa">
          {item?.so_thua || "Không có"}
        </Descriptions.Item>

        <Descriptions.Item label="Tờ bản đồ">
          {item?.so_to_ban_do || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Diện tích">
          {item?.dien_tich ? `${item.dien_tich} m²` : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Loại đất">
          {item?.loai_dat || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ" span={2}>
          {item?.dia_chi || "-"}
        </Descriptions.Item>
      </Descriptions>
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

      <Modal
        title={`📍 Thửa đất ${selected?.so_thua || ""}`}
        open={!!selected}
        width={1000}
        centered
        footer={null}
        onCancel={() => {
          setSelected(null);

          setLienKe(null);
        }}
      >
        {selected && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Số thửa">
                {selected.so_thua}
              </Descriptions.Item>

              <Descriptions.Item label="Tờ bản đồ">
                {selected.so_to_ban_do}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ" span={2}>
                {selected.dia_chi}
              </Descriptions.Item>

              <Descriptions.Item label="Diện tích">
                {selected.dien_tich} m²
              </Descriptions.Item>

              <Descriptions.Item label="Loại đất">
                {selected.loai_dat}
              </Descriptions.Item>

              <Descriptions.Item label="Mục đích">
                {selected.muc_dich_su_dung}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {renderTrangThai(selected.trang_thai)}
              </Descriptions.Item>

              <Descriptions.Item label="Chủ sở hữu" span={2}>
                {renderChuSoHuu()}

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Input
                    placeholder="Nhập CCCD chủ sở hữu"
                    value={soCccdMoi}
                    onChange={(e) => {
                      setSoCccdMoi(e.target.value);
                    }}
                    style={{
                      width: 300,
                    }}
                  />

                  <Button type="primary" onClick={themChuSoHuu}>
                    + Thêm
                  </Button>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}
