// src/pages/client/search/MapView.jsx

import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Row,
    Col,
    message
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import {
    MapContainer,
    TileLayer,
    GeoJSON
} from "react-leaflet";

import MapClickHandler from "./MapClickHandler";
import MapController from "./components/MapController";

const MapView = ({
    searchMode,
    activeMainTab,
    currentGeoData,
    searchLandMap,
    handleSearchCongTrinhMap,
    handleClick,
    mapRef
}) => {

    const [locationText, setLocationText] =
        useState("");

    const handleLocate = async () => {

        if (!locationText.trim()) {
            message.warning(
                "Nhập địa chỉ cần tìm"
            );
            return;
        }

        try {

            const keyword = `${locationText}, Việt Nam`;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`
            );

            const data =
                await res.json();

            console.log(
                "Nominatim:",
                data
            );
            console.log(data[0].display_name);

            if (!data.length) {
                message.warning(
                    "Không tìm thấy vị trí"
                );
                return;
            }

            const lat =
                Number(data[0].lat);

            const lng =
                Number(data[0].lon);

            console.log(
                "MapRef:",
                mapRef.current
            );

            if (!mapRef.current) {
                message.error(
                    "Map chưa khởi tạo"
                );
                return;
            }

            mapRef.current.flyTo(
                [lat, lng],
                18,
                {
                    duration: 1.5
                }
            );

            message.success(
                "Đã chuyển đến vị trí"
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Không thể tìm vị trí"
            );
        }
    };

    if (searchMode !== "map")
        return null;

    return (
        <Card
            style={{
                marginTop: 20
            }}
            title="Click vào bản đồ để tìm kiếm"
        >
            <Row
                gutter={8}
                style={{
                    marginBottom: 12
                }}
            >
                <Col flex="auto">
                    <Input
                        value={
                            locationText
                        }
                        onChange={(e) =>
                            setLocationText(
                                e.target.value
                            )
                        }
                        onPressEnter={
                            handleLocate
                        }
                        placeholder="Nhập địa chỉ hoặc tên địa điểm..."
                    />
                </Col>

                <Col>
                    <Button
                        type="primary"
                        icon={
                            <SearchOutlined />
                        }
                        onClick={
                            handleLocate
                        }
                    >
                        Tìm vị trí
                    </Button>
                </Col>
            </Row>

            <div
                style={{
                    height: 560
                }}
            >
                <MapContainer
                    center={[
                        21.0285,
                        105.8542
                    ]}
                    zoom={13}
                    style={{
                        height: "100%",
                        width: "100%",
                        cursor: "crosshair"
                    }}
                >
                    <MapController
                        mapRef={mapRef}
                    />

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler
                        activeMainTab={
                            activeMainTab
                        }
                        searchLandMap={
                            searchLandMap
                        }
                        handleSearchCongTrinhMap={
                            handleSearchCongTrinhMap
                        }
                    />

                    {currentGeoData.map(
                        (item) =>
                            item.geom && (
                                <GeoJSON
                                    key={
                                        item.id
                                    }
                                    data={
                                        item.geom
                                    }
                                    style={{
                                        color:
                                            activeMainTab ===
                                                "thuadat"
                                                ? "#1890ff"
                                                : "#ff4d4f",
                                        weight: 3,
                                        fillOpacity: 0.25
                                    }}
                                    onEachFeature={(
                                        feature,
                                        layer
                                    ) => {
                                        layer.on(
                                            "click",
                                            () => {
                                                handleClick(
                                                    item,
                                                    activeMainTab ===
                                                    "congtrinh"
                                                );
                                            }
                                        );
                                    }}
                                />
                            )
                    )}
                </MapContainer>
            </div>
        </Card>
    );
};

export default MapView;