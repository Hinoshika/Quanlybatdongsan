// src/pages/client/search/MapView.jsx
import { Card } from "antd";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import MapClickHandler from "./MapClickHandler";

const MapView = ({
    searchMode,
    activeMainTab,
    currentGeoData,
    searchLandMap,
    handleSearchCongTrinhMap,
    handleClick,
    mapRef
}) => {
    if (searchMode !== "map") return null;

    return (
        <Card
            style={{ marginTop: 20 }}
            bodyStyle={{ padding: 0 }}
            title="Click vào bản đồ để tìm kiếm"
        >
            <MapContainer
                center={[21.0285, 105.8542]}
                zoom={13}
                style={{
                    height: 560,
                    cursor: "crosshair"   // Thay đổi con trỏ khi hover
                }}
                whenCreated={(map) => {
                    mapRef.current = map;
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler
                    activeMainTab={activeMainTab}
                    searchLandMap={searchLandMap}
                    handleSearchCongTrinhMap={handleSearchCongTrinhMap}
                />

                {/* Hiển thị kết quả GeoJSON */}
                {currentGeoData.map((item) =>
                    item.geom && (
                        <GeoJSON
                            key={item.id}
                            data={item.geom}
                            style={{
                                color: activeMainTab === "thuadat" ? "#1890ff" : "#ff4d4f",
                                weight: 3,
                                fillOpacity: 0.25
                            }}
                            onEachFeature={(feature, layer) => {
                                layer.on("click", () => {
                                    handleClick(item, activeMainTab === "congtrinh");
                                });
                            }}
                        />
                    )
                )}
            </MapContainer>
        </Card>
    );
};

export default MapView;