import { useCallback, useEffect, useState } from "react";

import { Card, Input, Button, Space, message, Typography, Divider } from "antd";

import { MapContainer, TileLayer, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const { Title } = Typography;

// ===============================
// DRAW CONTROL
// ===============================

function DrawControl({ onCreated }) {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();

    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topright",

      draw: {
        polygon: true,

        polyline: false,

        rectangle: false,

        circle: false,

        marker: false,

        circlemarker: false,
      },

      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);

    const handleCreated = (e) => {
      const layer = e.layer;

      // giữ các thửa đã vẽ
      drawnItems.addLayer(layer);

      const geo = layer.toGeoJSON();

      console.log("GEOMETRY", geo.geometry);

      onCreated(geo.geometry);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      map.removeControl(drawControl);

      map.removeLayer(drawnItems);

      map.off(L.Draw.Event.CREATED, handleCreated);
    };
  }, [map, onCreated]);

  return null;
}

// ===============================
// TEST PAGE
// ===============================

export default function Test() {
  const [geometry, setGeometry] = useState(null);

  const [form, setForm] = useState({
    so_thua: "",

    so_to_ban_do: "",

    dia_chi: "",

    tinh: "",

    dien_tich: "",

    loai_dat: "",

    muc_dich_su_dung: "",

    hinh_thuc_su_dung: "",

    thoi_han_su_dung: "",

    nguon_goc_su_dung: "",
  });

  const handleCreated = useCallback((geo) => {
    setGeometry(geo);
  }, []);
  const [chuSoHuu, setChuSoHuu] = useState({
    ho_ten: "",
    so_cccd: "",
    so_dien_thoai: "",
    dia_chi: "",
    ty_le_so_huu: 100,
  });

  const save = async () => {
    if (!geometry) {
      message.warning("Chưa vẽ thửa đất");

      return;
    }

    const data = {
      so_thua: form.so_thua,

      so_to_ban_do: form.so_to_ban_do,

      dia_chi: form.dia_chi,

      tinh: form.tinh,

      dien_tich: Number(form.dien_tich),

      loai_dat: form.loai_dat,

      muc_dich_su_dung: form.muc_dich_su_dung,

      hinh_thuc_su_dung: form.hinh_thuc_su_dung,

      thoi_han_su_dung: form.thoi_han_su_dung,

      nguon_goc_su_dung: form.nguon_goc_su_dung,

      trang_thai: "Đang sử dụng",

      geometry,

      // thêm chủ sở hữu
      chu_so_huu: chuSoHuu,
    };

    console.log("DATA SEND", data);

    try {
      const res = await fetch(
        "http://localhost:5000/api/thuadat",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      console.log(result);

      if (result.success) {
        message.success("Đã lưu thửa đất");
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error(error);

      message.error("Lỗi kết nối server");
    }
  };

  return (
    <Card
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 9999,
          top: 20,
          left: 80,
          background: "#fff",
          padding: 15,
          width: 300,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Title level={4}>Thêm thửa đất</Title>

        <Space
          orientation="vertical"
          style={{
            width: "100%",
          }}
        >
          <Input
            placeholder="Số thửa *"
            value={form.so_thua}
            onChange={(e) =>
              setForm({
                ...form,
                so_thua: e.target.value,
              })
            }
          />

          <Input
            placeholder="Số tờ bản đồ *"
            value={form.so_to_ban_do}
            onChange={(e) =>
              setForm({
                ...form,
                so_to_ban_do: e.target.value,
              })
            }
          />

          <Input
            placeholder="Địa chỉ *"
            value={form.dia_chi}
            onChange={(e) =>
              setForm({
                ...form,
                dia_chi: e.target.value,
              })
            }
          />

          <Input
            placeholder="Tỉnh *"
            value={form.tinh}
            onChange={(e) =>
              setForm({
                ...form,
                tinh: e.target.value,
              })
            }
          />

          <Input
            placeholder="Diện tích"
            value={form.dien_tich}
            onChange={(e) =>
              setForm({
                ...form,
                dien_tich: e.target.value,
              })
            }
          />

          <Input
            placeholder="Loại đất *"
            value={form.loai_dat}
            onChange={(e) =>
              setForm({
                ...form,
                loai_dat: e.target.value,
              })
            }
          />

          <Input
            placeholder="Mục đích sử dụng"
            value={form.muc_dich_su_dung}
            onChange={(e) =>
              setForm({
                ...form,
                muc_dich_su_dung: e.target.value,
              })
            }
          />

          <Input
            placeholder="Hình thức sử dụng"
            value={form.hinh_thuc_su_dung}
            onChange={(e) =>
              setForm({
                ...form,
                hinh_thuc_su_dung: e.target.value,
              })
            }
          />

          <Input
            placeholder="Thời hạn sử dụng"
            value={form.thoi_han_su_dung}
            onChange={(e) =>
              setForm({
                ...form,
                thoi_han_su_dung: e.target.value,
              })
            }
          />

          <Input
            placeholder="Nguồn gốc sử dụng"
            value={form.nguon_goc_su_dung}
            onChange={(e) =>
              setForm({
                ...form,
                nguon_goc_su_dung: e.target.value,
              })
            }
          />
          <Divider>👤 Chủ sở hữu</Divider>

          <Input
            placeholder="Họ tên chủ sở hữu"
            value={chuSoHuu.ho_ten}
            onChange={(e) =>
              setChuSoHuu({
                ...chuSoHuu,
                ho_ten: e.target.value,
              })
            }
          />

          <Input
            placeholder="Số CCCD"
            value={chuSoHuu.so_cccd}
            onChange={(e) =>
              setChuSoHuu({
                ...chuSoHuu,
                so_cccd: e.target.value,
              })
            }
          />

          <Input
            placeholder="Số điện thoại"
            value={chuSoHuu.so_dien_thoai}
            onChange={(e) =>
              setChuSoHuu({
                ...chuSoHuu,
                so_dien_thoai: e.target.value,
              })
            }
          />

          <Input
            placeholder="Địa chỉ chủ sở hữu"
            value={chuSoHuu.dia_chi}
            onChange={(e) =>
              setChuSoHuu({
                ...chuSoHuu,
                dia_chi: e.target.value,
              })
            }
          />

          <Input
            placeholder="Tỷ lệ sở hữu (%)"
            type="number"
            value={chuSoHuu.ty_le_so_huu}
            onChange={(e) =>
              setChuSoHuu({
                ...chuSoHuu,
                ty_le_so_huu: Number(e.target.value),
              })
            }
          />

          <Button type="primary" block onClick={save}>
            Lưu thửa đất
          </Button>
        </Space>
      </div>

      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={15}
        style={{
          height: "calc(100vh - 150px)",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <DrawControl onCreated={handleCreated} />
      </MapContainer>
    </Card>
  );
}
