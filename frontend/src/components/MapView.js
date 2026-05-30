import {
    MapContainer,
    TileLayer,
    Polygon,
    Marker,
    useMap
} from "react-leaflet";
import { useEffect } from "react";

function MapFix() {
    const map = useMap();

    useEffect(() => {
        const t = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => clearTimeout(t);
    }, [map]);

    return null;
}

export default function GISMap({
    thuaDat,
    congTrinh
}) {
    // ================= POLYGON =================
    const geom =
        typeof thuaDat?.geom === "string"
            ? JSON.parse(thuaDat.geom)
            : thuaDat?.geom;

    const polygon =
        geom?.coordinates?.[0]?.map((c) => [c[1], c[0]]) || [];

    // ================= CENTER =================
    const center =
        thuaDat?.lat && thuaDat?.lng
            ? [thuaDat.lat, thuaDat.lng]
            : polygon[0] || [21.0285, 105.8542];

    return (
        <MapContainer
            key={(thuaDat?.id || congTrinh?.id) + ""}
            center={center}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
        >
            <MapFix />

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* ================= THỬA ĐẤT (POLYGON) ================= */}
            {polygon.length > 0 && (
                <Polygon
                    positions={polygon}
                    pathOptions={{
                        color: "blue",
                        fillColor: "blue",
                        fillOpacity: 0.2
                    }}
                />
            )}

            {/* ================= CÔNG TRÌNH (POINT) ================= */}
            {congTrinh?.lat && congTrinh?.lng && (
                <Marker position={[congTrinh.lat, congTrinh.lng]} />
            )}
        </MapContainer>
    );
}