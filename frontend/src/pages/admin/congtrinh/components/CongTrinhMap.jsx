import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";

function MapFix({ point }) {
    const map = useMap();

    useEffect(() => {
        const t = setTimeout(() => {
            map.invalidateSize(true);

            if (point) {
                map.setView(point, 16); // chắc chắn nhảy đúng vị trí
            }
        }, 300);

        return () => clearTimeout(t);
    }, [map, point]);

    return null;
}

export default function CongTrinhMap({ selected }) {

    const point = useMemo(() => {
        if (!selected?.geom) return null;

        try {
            const geo =
                typeof selected.geom === "string"
                    ? JSON.parse(selected.geom)
                    : selected.geom;

            if (!geo?.coordinates) return null;

            // GeoJSON: [lng, lat] → Leaflet: [lat, lng]
            return [geo.coordinates[1], geo.coordinates[0]];
        } catch (e) {
            console.log("geom parse error:", e);
            return null;
        }
    }, [selected]);

    if (!point) {
        return (
            <div style={{ marginTop: 16, color: "gray" }}>
                Chưa có vị trí 📍
            </div>
        );
    }

    return (
        <div style={{ height: 320, marginTop: 16 }}>
            <MapContainer
                center={point}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                key={selected?.id}
            >
                <MapFix point={point} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={point} />
            </MapContainer>
        </div>
    );
}