import { useEffect, useState } from "react";

import {
    getCongTrinh,
    getCongTrinhById,
    searchCongTrinh
} from "../../../services/congTrinh.service";

import { getThuaDat } from "../../../services/thuaDat.service";

import CongTrinhTable from "./components/CongTrinhTable";
import CongTrinhModal from "./components/CongTrinhModal";
import CongTrinhFilter from "./components/CongTrinhFilter";

export default function CongTrinh() {

    const [data, setData] = useState([]);
    const [thuaDatList, setThuaDatList] = useState([]);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const [filters, setFilters] = useState({
        so_cccd: "",
        loai_cong_trinh: null,
        trang_thai: null,
        dien_tich_min: null,
        dien_tich_max: null
    });

    // ================= FETCH =================
    const fetchData = async (params = null) => {
        try {
            let cleanParams = {};

            if (params) {
                Object.keys(params).forEach((key) => {
                    if (
                        params[key] !== null &&
                        params[key] !== ""
                    ) {
                        cleanParams[key] = params[key];
                    }
                });
            }

            const hasFilter = Object.keys(cleanParams).length > 0;

            const res = hasFilter
                ? await searchCongTrinh(cleanParams)
                : await getCongTrinh();

            setData(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error(err);
            setData([]);
        }
    };

    const fetchThuaDat = async () => {
        try {
            const res = await getThuaDat();
            setThuaDatList(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error(err);
            setThuaDatList([]);
        }
    };

    useEffect(() => {
        fetchData();
        fetchThuaDat();
    }, []);

    // ================= CRUD =================
    const handleAdd = () => {
        setSelected(null);
        setOpen(true);
    };

    const handleEdit = async (record) => {
        try {
            const detail = await getCongTrinhById(record.id);
            setSelected(detail);
            setOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
        fetchData(filters);
    };

    // ================= FILTER =================
    const onSearch = () => {
        fetchData(filters);
    };

    const onReset = () => {
        const reset = {
            so_cccd: "",
            loai_cong_trinh: null,
            trang_thai: null,
            dien_tich_min: null,
            dien_tich_max: null
        };

        setFilters(reset);
        fetchData();
    };

    return (
        <div
            style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#f5f5f5",
                minHeight: "100vh"
            }}
        >

            {/* ================= HEADER ================= */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h2 style={{ margin: 0 }}>
                    🏗️ Quản lý công trình
                </h2>
            </div>

            {/* ================= FILTER ================= */}

            <CongTrinhFilter
                filters={filters}
                setFilters={setFilters}
                onSearch={onSearch}
                onReset={onReset}
            />

            {/* ================= TABLE ================= */}
            <div
                style={{
                    background: "#fff",
                    padding: 12,
                    borderRadius: 8,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
                }}
            >
                <CongTrinhTable
                    data={data}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onReload={() => fetchData(filters)}
                />
            </div>

            {/* ================= MODAL ================= */}
            <CongTrinhModal
                open={open}
                selected={selected}
                onClose={handleClose}
                thuaDatList={thuaDatList}
                onReload={() => fetchData(filters)}
            />

        </div>
    );
}