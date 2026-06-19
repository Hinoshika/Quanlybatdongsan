import { useEffect, useState } from "react";

import { Card, Modal, Descriptions, Tag, Spin, Alert, Divider } from "antd";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  getAllThuaDatMap,
  getThuaDatMapByThuaDat,
} from "../../../services/thuaDatMap.service";

export default function BanDo() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);

  const [lienKe, setLienKe] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // ================= LOAD MAP =================

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getAllThuaDatMap();

      console.log("THUA DAT MAP:", result);

      setData(result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD LIEN KE =================

  const loadLienKe = async (id) => {
    try {
      const result = await getThuaDatMapByThuaDat(id);

      console.log("LIEN KE:", result);

      setLienKe(result);
    } catch (error) {
      console.error(error);

      setLienKe(null);
    }
  };

  const handleClickThuaDat = async (item) => {
    setSelected(item);

    await loadLienKe(item.id);
  };

  // ================= STYLE =================

  const getStyle = (feature) => {
    const status = feature.properties?.trang_thai;

    let color = "#1677ff";

    switch (status) {
      case "dang_su_dung":
        color = "#52c41a";

        break;

      case "tranh_chap":
        color = "#ff4d4f";

        break;

      case "thu_hoi":
        color = "#8c8c8c";

        break;

      default:
        color = "#faad14";
    }

    return {
      color,

      fillColor: color,

      fillOpacity: 0.5,

      weight: 2,
    };
  };

  const renderTrangThai = (status) => {
    if (!status) return "";

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

  return (
    <>
      <Alert
        message="Click vào thửa đất trên bản đồ để xem thông tin chi tiết"
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
              <LayersControl.BaseLayer checked name="Bản đồ">
                <TileLayer
                  attribution="© OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Vệ tinh">
                <TileLayer
                  attribution="© Esri"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Hybrid">
                <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
              </LayersControl.BaseLayer>
            </LayersControl>

            {data.map((item) => {
              if (!item.geom) return null;

              let geom = item.geom;

              if (typeof geom === "string") {
                geom = JSON.parse(geom);
              }

              return (
                <GeoJSON
                  key={item.id}
                  data={{
                    type: "Feature",

                    geometry: geom,

                    properties: item,
                  }}
                  style={getStyle}
                  eventHandlers={{
                    click: () => {
                      handleClickThuaDat(item);
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
        onCancel={() => {
          setSelected(null);

          setLienKe(null);
        }}
        footer={null}
        width={1000}
        centered
        destroyOnHidden
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

              <Descriptions.Item label="Tỉnh">
                {selected.tinh}
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

              <Descriptions.Item label="Hình thức">
                {selected.hinh_thuc_su_dung}
              </Descriptions.Item>

              <Descriptions.Item label="Thời hạn">
                {selected.thoi_han_su_dung}
              </Descriptions.Item>

              <Descriptions.Item label="Nguồn gốc" span={2}>
                {selected.nguon_goc_su_dung}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái" span={2}>
                {renderTrangThai(selected.trang_thai)}
              </Descriptions.Item>
            </Descriptions>

            <Divider>🧭 Thửa đất liền kề</Divider>

            {[
              ["bac", "⬆ Bắc"],
              ["dong", "➡ Đông"],
              ["tay", "⬅ Tây"],
              ["nam", "⬇ Nam"],
            ].map(([key, label]) => {
              const item = lienKe?.[key];

              return (
                <Descriptions
                  key={key}
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
                    {item?.so_to_ban_do || ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Diện tích">
                    {item?.dien_tich ? `${item.dien_tich} m²` : ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Loại đất">
                    {item?.loai_dat || ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Địa chỉ" span={2}>
                    {item?.dia_chi || ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Trạng thái" span={2}>
                    {renderTrangThai(item?.trang_thai)}
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </>
        )}
      </Modal>
    </>
  );
}
