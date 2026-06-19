// src/pages/client/search/MapView.jsx

import { useState } from "react";

import { Card, Input, Button, Row, Col, message } from "antd";

import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ZoomControl,
} from "react-leaflet";

import MapClickHandler from "./MapClickHandler";
import MapController from "./components/MapController";

const { BaseLayer } = LayersControl;

const MapView = ({
  searchMode,
  activeMainTab,
  currentGeoData,
  searchLandMap,
  handleSearchCongTrinhMap,
  handleClick,
  mapRef,
}) => {
  const [locationText, setLocationText] = useState("");

  const handleLocate = async () => {
    if (!locationText.trim()) {
      message.warning("Nhập địa chỉ cần tìm");

      return;
    }

    try {
      const keyword = `${locationText}, Việt Nam`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`,
      );

      const data = await res.json();

      if (!data.length) {
        message.warning("Không tìm thấy vị trí");

        return;
      }

      const lat = Number(data[0].lat);

      const lng = Number(data[0].lon);

      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 18, {
          duration: 1.5,
        });
      }

      message.success("Đã di chuyển tới vị trí");
    } catch (err) {
      console.log(err);

      message.error("Lỗi tìm vị trí");
    }
  };

  if (searchMode !== "map") return null;

  return (
    <Card
      className="map-card"
      style={{
        marginTop: 20,
        borderRadius: 16,
        overflow: "hidden",
      }}
      title={<span>🗺️ Bản đồ tìm kiếm thửa đất</span>}
    >
      <Row
        gutter={10}
        style={{
          marginBottom: 15,
        }}
      >
        <Col flex="auto">
          <Input
            size="large"
            prefix={<EnvironmentOutlined />}
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            onPressEnter={handleLocate}
            placeholder="Nhập địa chỉ, số nhà, phường, quận..."
          />
        </Col>

        <Col>
          <Button
            size="large"
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleLocate}
          >
            Tìm vị trí
          </Button>
        </Col>
      </Row>

      <div
        style={{
          height: 600,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,.15)",
        }}
      >
        <MapContainer
          ref={mapRef}
          center={[21.0285, 105.8542]}
          zoom={13}
          zoomControl={false}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <ZoomControl position="bottomright" />

          <MapController mapRef={mapRef} />

          <LayersControl position="topright">
            {/* BẢN ĐỒ THƯỜNG */}
            <BaseLayer checked name="🗺️ Bản đồ đường phố">
              <TileLayer
                url="
                            https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                            "
              />
            </BaseLayer>

            {/* VỆ TINH */}
            <BaseLayer name="🛰️ Ảnh vệ tinh">
              <TileLayer
                url="
                            https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
                            "
              />
            </BaseLayer>

            {/* VỆ TINH CÓ NHÃN */}
            <BaseLayer name="🌍 Vệ tinh + địa danh">
              <TileLayer
                url="
                            https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}
                            "
              />
            </BaseLayer>
          </LayersControl>

          <MapClickHandler
            activeMainTab={activeMainTab}
            searchLandMap={searchLandMap}
            handleSearchCongTrinhMap={handleSearchCongTrinhMap}
          />

          {currentGeoData.map(
            (item) =>
              item.geom && (
                <GeoJSON
                  key={item.id}
                  data={item.geom}
                  style={() => ({
                    color: activeMainTab === "thuadat" ? "#0066ff" : "#ff0000",

                    weight: 3,

                    fillColor:
                      activeMainTab === "thuadat" ? "#1890ff" : "#ff4d4f",

                    fillOpacity: 0.35,

                    dashArray: "5,5",
                  })}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      mouseover: () => {
                        layer.setStyle({
                          weight: 5,

                          fillOpacity: 0.55,
                        });
                      },

                      mouseout: () => {
                        layer.setStyle({
                          weight: 3,

                          fillOpacity: 0.35,
                        });
                      },

                      click: () => {
                        handleClick(item, activeMainTab === "congtrinh");
                      },
                    });
                  }}
                />
              ),
          )}
        </MapContainer>
      </div>
    </Card>
  );
};

export default MapView;
