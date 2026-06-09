import { useEffect, useState, useMemo } from "react";
import { Button, message } from "antd";

import {
    getThuaDat,
    getThuaDatById,
    createThuaDat,
    updateThuaDat,
    getChuSoHuuByCCCD,
    createCongTrinh,
    searchByCCCD
} from "../../../services/thuaDat.service";

import { transferSoHuuThuaDat } from "../../../services/soHuuThuaDat.service";

import { createBienDong } from "../../../services/bienDong.service";

import ThuaDatFilter from "./components/ThuaDatFilter";
import ThuaDatTable from "./components/ThuaDatTable";
import ThuaDatModal from "./components/ThuaDatModal";
import CongTrinhModal from "./components/CongTrinhModal";
import ChuyenSoHuu from "./components/ChuyenSoHuu";
import GopThuaModal from "./components/GopThuaModal";
import TachThuaModal from "./components/TachThuaModal";
import AddThuaDatModal from "./components/AddThuaDatModal";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function ThuaDat() {

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);

    const [selectedOwner, setSelectedOwner] = useState(null);

    const [open, setOpen] = useState(false);
    const [openCongTrinh, setOpenCongTrinh] = useState(false);
    const [openChuyenSoHuu, setOpenChuyenSoHuu] = useState(false);

    const [chuSoHuuCongTrinh, setChuSoHuuCongTrinh] = useState(null);

    const [openGopThua, setOpenGopThua] = useState(false);
    const [openTachThua, setOpenTachThua] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const [filters, setFilters] = useState({
        so_cccd: null,
        loai_dat: null,
        trang_thai: null,
        tinh: null,
        dien_tich_min: null,
        dien_tich_max: null,
    });

    // ================= FETCH =================
    const fetchData = async (query = {}) => {
        try {
            const res = await getThuaDat(query);
            setData(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= FILTER =================
    const handleSearch = async () => {
        if (filters.so_cccd) {
            const res = await searchByCCCD(filters.so_cccd);
            setData(res);
            return;
        }
        fetchData(filters);
    };

    const handleReset = () => {
        setFilters({
            so_cccd: null,
            loai_dat: null,
            trang_thai: null,
            tinh: null,
            dien_tich_min: null,
            dien_tich_max: null,
        });
        fetchData();
    };

    const handleCreate = async (values) => {
        try {

            const res = await createThuaDat(values);

            message.success(
                res?.message || "Thêm thửa đất thành công"
            );

            setOpenAdd(false);
            fetchData();

        } catch (err) {

            message.error(
                err.response?.data?.message ||
                err.message ||
                "Có lỗi xảy ra"
            );

            console.error(err);
        }
    };

    // ================= DETAIL =================
    const handleRowClick = async (record) => {
        try {
            const res = await getThuaDatById(record.id);
            setSelected(res);
            setDetail(res);
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selected) {
                await updateThuaDat(selected.id, values);
            }

            setOpen(false);
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    // ================= CONG TRINH =================
    const handleSearchCCCDCongTrinh = async (value) => {
        if (!value) {
            setChuSoHuuCongTrinh(null);
            return null;
        }

        try {
            const res = await getChuSoHuuByCCCD(value);
            setChuSoHuuCongTrinh(res);
            return res;
        } catch (err) {
            console.log(err);
            setChuSoHuuCongTrinh(null);
            return null;
        }
    };

    const handlesubmitCongTrinh = async (values) => {
        try {
            if (!selected?.id) return;

            const payload = {
                ...values,
                thua_dat_id: selected.id,
                so_tang: Number(values.so_tang || 0),
                dien_tich_xay_dung: Number(values.dien_tich_xay_dung || 0),
                tong_dien_tich_san: Number(values.tong_dien_tich_san || 0),
                nam_xay_dung: values.nam_xay_dung
                    ? Number(values.nam_xay_dung)
                    : null
            };

            await createCongTrinh(payload);

            setOpenCongTrinh(false);
            setChuSoHuuCongTrinh(null);

            const res = await getThuaDatById(selected.id);
            setDetail(res);

        } catch (err) {
            console.log(err);
        }
    };

    // ================= OPEN TRANSFER =================
    const handleOpenTransfer = (owner) => {

        const mappedOwner = {
            so_huu_id: owner.so_huu_id,
            owner_id: owner.id,   // ✅ FIX CHÍNH Ở ĐÂY
            ho_ten: owner.ho_ten,
            so_cccd: owner.so_cccd,
            ty_le_so_huu: owner.ty_le_so_huu
        };

        setSelectedOwner(mappedOwner);
        setOpenChuyenSoHuu(true);
    };

    // ================= TRANSFER =================

    const handleTransfer = async (values) => {
        try {
            // =======================
            // 1. TRANSFER OWNERSHIP
            // =======================
            const transferPayload = {
                thua_dat_id: detail.id,
                chu_so_huu_cu_id: selectedOwner.owner_id,
                chu_so_huu_moi_id: values.chu_so_huu_moi_id,
                ty_le_chuyen: Number(values.ty_le_chuyen)
            };

            console.log("🚀 TRANSFER:", transferPayload);

            await transferSoHuuThuaDat(transferPayload);

            // =======================
            // 2. CREATE BIẾN ĐỘNG
            // =======================
            const bienDongPayload = {
                thua_dat_id: detail.id,
                loai_bien_dong: "chuyen_nhuong",
                chu_so_huu_cu_id: selectedOwner.owner_id,
                chu_so_huu_moi_id: values.chu_so_huu_moi_id,
                ty_le_chuyen: Number(values.ty_le_chuyen),
                gia_tri_giao_dich: values.gia_tri_giao_dich || 0,
                noi_dung: values.ghi_chu || "",
                ngay_bien_dong: values.ngay_bien_dong
            };

            console.log("📌 BIEN DONG:", bienDongPayload);

            await createBienDong(bienDongPayload);

            setOpenChuyenSoHuu(false);
            setSelectedOwner(null);

            const res = await getThuaDatById(detail.id);
            setDetail(res);

        } catch (err) {
            console.log("❌ TRANSFER ERROR:", err);
        }
    };
    // ================= DEDUPE OWNERS =================
    const uniqueOwners = useMemo(() => {
        const list = detail?.chu_so_huu || [];

        return Array.from(
            new Map(
                list.map(o => [o.so_huu_id || o.id, o])
            ).values()
        );
    }, [detail]);

    const role = localStorage.getItem("role");

    return (
        <div style={{ padding: 24 }}>

            <h2>🏡 Quản lý thửa đất</h2>

            <ThuaDatFilter
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
                onReset={handleReset}
            />

            <ThuaDatTable
                data={data}
                onRowClick={handleRowClick}
            />
            {role === "admin" && (

                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>

                    <Button type="primary" onClick={() => {
                        setSelected(null);
                        setDetail(null);
                        setOpenAdd(true);
                    }}>
                        + Thêm thửa đất
                    </Button>

                    <Button
                        type="primary"
                        onClick={() => setOpenGopThua(true)}
                    >
                        🔗 Gộp thửa
                    </Button>

                    <Button
                        danger
                        onClick={() => setOpenTachThua(true)}
                    >
                        ✂️ Tách thửa
                    </Button>


                </div>
            )}
            <GopThuaModal
                open={openGopThua}
                onClose={() => setOpenGopThua(false)}
                data={data}
                onSubmit={(values) => console.log("GỘP:", values)}
            />

            <TachThuaModal
                open={openTachThua}
                onClose={() => setOpenTachThua(false)}
                selected={selected}
                onSubmit={(values) => console.log("TÁCH:", values)}
            />

            <AddThuaDatModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSubmit={handleCreate}
            />

            <ThuaDatModal
                open={open}
                onClose={() => setOpen(false)}
                selected={selected}
                detail={detail}
                onSubmit={handleSubmit}
                onOpenCongTrinh={() => setOpenCongTrinh(true)}
                onOpenTransfer={handleOpenTransfer}
            />

            <CongTrinhModal
                open={openCongTrinh}
                onClose={() => setOpenCongTrinh(false)}
                onSubmit={handlesubmitCongTrinh}
                onSearchCCCD={handleSearchCCCDCongTrinh}
                chuSoHuuCongTrinh={chuSoHuuCongTrinh}
                selected={selected}
            />

            <ChuyenSoHuu
                open={openChuyenSoHuu}
                onClose={() => {
                    setOpenChuyenSoHuu(false);
                    setSelectedOwner(null);
                    setChuSoHuuCongTrinh(null);
                }}
                onSubmit={handleTransfer}
                onSearchCCCD={handleSearchCCCDCongTrinh}
                chuSoHuuMoi={chuSoHuuCongTrinh}
                owners={uniqueOwners}
                selectedOwner={selectedOwner}
            />

        </div>
    );
}