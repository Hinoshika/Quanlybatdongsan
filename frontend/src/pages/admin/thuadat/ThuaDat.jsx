import { useEffect, useState, useMemo } from "react";
import { Button, message, Card, Row, Col, Space, Tag, Statistic, Input, Select, Typography, Tooltip, Avatar, Empty } from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    MergeCellsOutlined,
    ScissorOutlined,
    ReloadOutlined,
    ExportOutlined,
    FilterOutlined,
    HomeOutlined,
    UserOutlined,
    AreaChartOutlined,
    InboxOutlined
} from "@ant-design/icons";

import {
    getThuaDat,
    getThuaDatById,
    createThuaDat,
    updateThuaDat,
    getChuSoHuuByCCCD,
    createCongTrinh,
    searchByCCCD,
    mergeThuaDat,
    tachThuaDat
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

const { Title, Text } = Typography;

export default function ThuaDat() {

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false); // Thêm state loading để UX mượt hơn

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

    // ================= UTILS =================
    // Tính toán thống kê nhanh
    const stats = useMemo(() => {
        const total = data.length;
        const totalArea = data.reduce((acc, curr) => acc + (Number(curr.dien_tich) || 0), 0);
        const activeCount = data.filter(item => item.trang_thai === "đang sử dụng").length;
        return { total, totalArea: totalArea.toFixed(2), activeCount };
    }, [data]);

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
            message.success(res?.message || "Thêm thửa đất thành công");
            setOpenAdd(false);
            fetchData();
        } catch (err) {
            message.error(err.response?.data?.message || err.message || "Có lỗi xảy ra");
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
                nam_xay_dung: values.nam_xay_dung ? Number(values.nam_xay_dung) : null
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
            owner_id: owner.id,
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
            const transferPayload = {
                thua_dat_id: detail.id,
                chu_so_huu_cu_id: selectedOwner.owner_id,
                chu_so_huu_moi_id: values.chu_so_huu_moi_id,
                ty_le_chuyen: Number(values.ty_le_chuyen)
            };
            console.log("🚀 TRANSFER:", transferPayload);
            await transferSoHuuThuaDat(transferPayload);

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

    const handleMergeThua = async (payload) => {
        try {

            const res = await mergeThuaDat(payload);

            message.success(
                res.message || "Gộp thửa thành công"
            );

            fetchData();

            return true;

        } catch (err) {

            message.error(
                err.message || "Gộp thửa thất bại"
            );

            return false;
        }
    };

    const handleTachThua = async (payload) => {
        try {
            const res = await tachThuaDat(payload);

            message.success(
                res.message || "Tách thửa thành công"
            );

            setOpenTachThua(false);

            await fetchData();

            return true;

        } catch (err) {

            console.error(err);

            message.error(
                err.message || "Tách thửa thất bại"
            );

            return false;
        }
    };
    // ================= DEDUPE OWNERS =================
    const uniqueOwners = useMemo(() => {
        const list = detail?.chu_so_huu || [];
        return Array.from(new Map(list.map(o => [o.so_huu_id || o.id, o])).values());
    }, [detail]);

    const role = localStorage.getItem("role");

    // ================= RENDER UI =================
    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>

            {/* --- HEADER & STATS --- */}
            {/* <div style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Tổng số thửa đất"
                                value={stats.total}
                                prefix={<InboxOutlined style={{ color: '#1890ff' }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Tổng diện tích (m²)"
                                value={stats.totalArea}
                                prefix={<AreaChartOutlined style={{ color: '#52c41a' }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Đang sử dụng"
                                value={stats.activeCount}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<HomeOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Chờ xử lý"
                                value={stats.total - stats.activeCount}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div> */}

            {/* --- TOOLBAR & FILTER --- */}
            <Card
                bordered={false}
                style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: '16px 24px' }}
            >
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Space wrap>
                            <Text strong style={{ fontSize: 16 }}>Danh sách thửa đất</Text>
                        </Space>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space>
                            {/* <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchData()}
                                title="Làm mới"
                            >
                                Làm mới
                            </Button> */}
                            {role === "admin" && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            setSelected(null);
                                            setDetail(null);
                                            setOpenAdd(true);
                                        }}
                                        style={{ borderRadius: 6 }}
                                    >
                                        Thêm mới
                                    </Button>
                                    <Button
                                        icon={<MergeCellsOutlined />}
                                        onClick={() => setOpenGopThua(true)}
                                    >
                                        Gộp thửa
                                    </Button>
                                    <Button
                                        danger
                                        icon={<ScissorOutlined />}
                                        onClick={() => setOpenTachThua(true)}
                                    >
                                        Tách thửa
                                    </Button>
                                </>
                            )}
                        </Space>
                    </Col>
                </Row>

                {/* Filter Component */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                    <ThuaDatFilter
                        filters={filters}
                        setFilters={setFilters}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />
                </div>
            </Card>

            {/* --- DATA TABLE --- */}
            <Card
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: 0 }}
            >
                <ThuaDatTable
                    data={data}
                    loading={loading}
                    onRowClick={handleRowClick}
                />
            </Card>

            {/* --- MODALS --- */}
            <GopThuaModal
                open={openGopThua}
                onClose={() => setOpenGopThua(false)}
                data={data}
                onSubmit={handleMergeThua}
            />

            <TachThuaModal
                open={openTachThua}
                onClose={() => setOpenTachThua(false)}
                onSubmit={handleTachThua}
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