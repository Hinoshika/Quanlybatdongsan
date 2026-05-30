export const parseGeom = (geom) => {

    if (!geom) return null;

    if (typeof geom === "string") {

        try {
            return JSON.parse(geom);
        } catch {
            return null;
        }
    }

    return geom;
};

export const getCenter = (selected, geom) => {

    const firstCoord =
        geom?.coordinates?.[0]?.[0];

    return selected?.lat && selected?.lng
        ? [selected.lat, selected.lng]
        : firstCoord
            ? [firstCoord[1], firstCoord[0]]
            : [21.0285, 105.8542];
};

export const getPolygonPositions = (geom) => {

    if (geom?.type !== "Polygon") {
        return [];
    }

    return geom.coordinates[0].map((c) => [
        c[1],
        c[0]
    ]);
};