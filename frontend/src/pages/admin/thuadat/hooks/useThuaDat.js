import { useEffect, useState, useMemo } from "react";
import { message } from "antd";

import {
    getThuaDat,
    getThuaDatById,
    createThuaDat,
    updateThuaDat,
    getChuSoHuuByCCCD,
    createCongTrinh,
    searchByCCCD
} from "../../../services/thuaDat.service";

import {
    transferSoHuuThuaDat
} from "../../../services/soHuuThuaDat.service";

import {
    createBienDong
} from "../../../services/bienDong.service";

export default function useThuaDat() {

    const [data, setData] = useState([]);
    const [detail, setDetail] = useState(null);
    const [selected, setSelected] = useState(null);

    const [loading, setLoading] = useState(false);

    // modals
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openGop, setOpenGop] = useState(false);
    const [openTach, setOpenTach] = useState(false);
    const [openCongTrinh, setOpenCongTrinh] = useState(false);
    const [openChuyen, setOpenChuyen] = useState(false);

    const [selectedOwner, setSelectedOwner] = useState(null);
    const [chuSoHuuCongTrinh, setChuSoHuuCongTrinh] = useState(null);

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
        setLoading(true);
        try {
            const res = await getThuaDat(query);
            setData(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= SEARCH =================
    const handleSearch = async () => {
        if (filters.so_cccd) {
            const res = await searchByCCCD(filters.so_cccd);
            setData(res || []);
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

    // ================= CREATE =================
    const handleCreate = async (values) => {
        try {
            const res = await createThuaDat(values);
            message.success(res?.message || "Thêm thành công");
            setOpenAdd(false);
            fetchData();
        } catch (err) {
            message.error("Lỗi thêm thửa đất");
        }
    };

    // ================= DETAIL =================
    const handleRowClick = async (record) => {
        const res = await getThuaDatById(record.id);
        setSelected(res);
        setDetail(res);
        setOpen(true);
    };

    // ================= UPDATE =================
    const handleUpdate = async (values) => {
        try {
            await updateThuaDat(selected.id, values);
            setOpen(false);
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    // ================= CONG TRINH =================
    const handleSearchCCCD = async (value) => {
        if (!value) return setChuSoHuuCongTrinh(null);
        const res = await getChuSoHuuByCCCD(value);
        setChuSoHuuCongTrinh(res);
    };

    const handleCreateCongTrinh = async (values) => {
        if (!selected?.id) return;

        await createCongTrinh({
            ...values,
            thua_dat_id: selected.id,
            so_tang: Number(values.so_tang || 0)
        });

        setOpenCongTrinh(false);
        const res = await getThuaDatById(selected.id);
        setDetail(res);
    };

    // ================= TRANSFER =================
    const handleOpenTransfer = (owner) => {
        setSelectedOwner({
            so_huu_id: owner.so_huu_id,
            owner_id: owner.id,
            ho_ten: owner.ho_ten,
            so_cccd: owner.so_cccd
        });
        setOpenChuyen(true);
    };

    const handleTransfer = async (values) => {
        try {
            await transferSoHuuThuaDat({
                thua_dat_id: detail.id,
                chu_so_huu_cu_id: selectedOwner.owner_id,
                chu_so_huu_moi_id: values.chu_so_huu_moi_id,
                ty_le_chuyen: Number(values.ty_le_chuyen)
            });

            await createBienDong({
                thua_dat_id: detail.id,
                loai_bien_dong: "chuyen_nhuong",
                chu_so_huu_cu_id: selectedOwner.owner_id,
                chu_so_huu_moi_id: values.chu_so_huu_moi_id
            });

            setOpenChuyen(false);
            setSelectedOwner(null);

            const res = await getThuaDatById(detail.id);
            setDetail(res);

        } catch (err) {
            console.log(err);
        }
    };

    // ================= OWNERS =================
    const uniqueOwners = useMemo(() => {
        const list = detail?.chu_so_huu || [];
        return Array.from(
            new Map(list.map(o => [o.so_huu_id || o.id, o])).values()
        );
    }, [detail]);

    return {
        data,
        detail,
        selected,
        loading,
        filters,
        setFilters,

        // modals
        open, setOpen,
        openAdd, setOpenAdd,
        openGop, setOpenGop,
        openTach, setOpenTach,
        openCongTrinh, setOpenCongTrinh,
        openChuyen, setOpenChuyen,

        selectedOwner,
        chuSoHuuCongTrinh,
        uniqueOwners,

        // actions
        fetchData,
        handleSearch,
        handleReset,
        handleCreate,
        handleRowClick,
        handleUpdate,
        handleSearchCCCD,
        handleCreateCongTrinh,
        handleOpenTransfer,
        handleTransfer
    };
}