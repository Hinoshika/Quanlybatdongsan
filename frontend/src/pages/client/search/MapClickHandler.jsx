// src/pages/client/search/MapClickHandler.jsx
import { useMapEvents } from "react-leaflet";
import { message } from "antd";

const MapClickHandler = ({
    activeMainTab,
    searchLandMap,
    handleSearchCongTrinhMap
}) => {

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;

            console.log(`📍 Click tại: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);

            // Thông báo đang tìm kiếm
            const loadingKey = 'map-search-loading';
            message.loading({
                content: `Đang tìm ${activeMainTab === "thuadat" ? "Thửa Đất" : "Công Trình"} tại vị trí...`,
                key: loadingKey,
                duration: 0
            });

            try {
                if (activeMainTab === "thuadat") {
                    await searchLandMap(lat, lng);
                } else if (activeMainTab === "congtrinh") {
                    await handleSearchCongTrinhMap(lat, lng);
                }

                // Thành công
                message.success({
                    content: "Tìm kiếm hoàn tất!",
                    key: loadingKey,
                    duration: 2
                });

            } catch (error) {
                console.error(error);
                message.error({
                    content: "Tìm kiếm thất bại, vui lòng thử lại",
                    key: loadingKey,
                    duration: 3
                });
            }
        },
    });

    return null;
};

export default MapClickHandler;