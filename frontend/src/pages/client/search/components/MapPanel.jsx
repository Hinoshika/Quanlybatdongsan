import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

function ClickHandler({ onClickMap }) {
    useMapEvents({
        click(e) {
            onClickMap(e.latlng.lat, e.latlng.lng);
        }
    });

    return null;
}

export default function MapPanel({ onClickMap }) {

    return (
        <MapContainer
            center={[21.0285, 105.8542]}
            zoom={13}
            style={{ height: "400px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ClickHandler onClickMap={onClickMap} />
        </MapContainer>
    );
}