import { useState } from "react";
import {
    searchByCccdApi,
    searchByMapApi,
    getThuaDetailApi
} from "../../../../api/search.api";

export default function useSearch() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    // ================= SEARCH CCCD =================
    const searchByCccd = async (cccd) => {
        setLoading(true);
        try {
            const res = await searchByCccdApi(cccd);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    // ================= SEARCH MAP =================
    const searchByMap = async (lat, lng) => {
        setLoading(true);
        try {
            const res = await searchByMapApi(lat, lng);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    // ================= SELECT THỬA =================
    const selectThua = async (record) => {
        const res = await getThuaDetailApi(record.id);
        setSelected(res.data);
    };

    return {
        loading,
        data,
        selected,
        setSelected,
        searchByCccd,
        searchByMap,
        selectThua
    };
}