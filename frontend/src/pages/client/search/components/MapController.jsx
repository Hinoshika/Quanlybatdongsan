// src/pages/client/search/MapController.jsx

import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapController({
    mapRef
}) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    return null;
}