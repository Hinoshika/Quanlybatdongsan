import {
    MapContainer,
    TileLayer,
    Polygon,
    Marker
} from "react-leaflet";

import {
    parseGeom,
    getCenter,
    getPolygonPositions
} from "../utils/geometry";

export default function ThuaDatMap({
    selected
}) {

    const geom = parseGeom(selected?.geom);

    const center = getCenter(selected, geom);

    const polygonPositions = getPolygonPositions(geom);

    if (!geom) {

        return (
            <div
                style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "gray"
                }}
            >
                Chưa có dữ liệu bản đồ 📍
            </div>
        );
    }

    return (
        <div style={{ height: 300, marginTop: 16 }}>

            <MapContainer
                key={selected?.id}
                center={center}
                zoom={16}
                style={{
                    height: "100%",
                    width: "100%"
                }}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polygon
                    positions={polygonPositions}
                    pathOptions={{ color: "blue" }}
                />

                {selected?.lat && selected?.lng && (
                    <Marker
                        position={[
                            selected.lat,
                            selected.lng
                        ]}
                    />
                )}

            </MapContainer>

        </div>
    );
}