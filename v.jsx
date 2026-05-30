import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select } from "antd";
import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";

import {
    getThuaDat,
    getThuaDatById,
    createThuaDat,
    updateThuaDat,
    getChuSoHuuByCCCD,
    createCongTrinh
} from "../../../services/thuaDat.service";
// safe parse geom
const parseGeom = (geom) => {
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

export default function ThuaDat() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [form] = Form.useForm();
    const [openCongTrinh, setOpenCongTrinh] = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [cccdCongTrinh, setCccdCongTrinh] = useState("");
    const [chuSoHuuCongTrinh, setChuSoHuuCongTrinh] = useState(null);

    // ================= SEARCH FILTER =================
    const [filters, setFilters] = useState({
        so_cccd: null,   // ✅ FIX THIẾU
        loai_dat: null,
        trang_thai: null,
        tinh: null,
        dien_tich_min: null,
        dien_tich_max: null,
    });

    const handleSearchCCCDCongTrinh = async (value) => {
        if (!value) {
            setChuSoHuuCongTrinh(null);

            form.setFieldsValue({
                chu_so_huu_id: null
            });

            return;
        }

        try {
            const res = await getChuSoHuuByCCCD(value);

            setChuSoHuuCongTrinh(res);

            form.setFieldsValue({
                chu_so_huu_id: res?.id || null
            });

        } catch (err) {
            console.log(err);

            setChuSoHuuCongTrinh(null);

            form.setFieldsValue({
                chu_so_huu_id: null
            });
        }
    };

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

    const handleSearch = () => {
        fetchData(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            so_cccd: null,
            loai_dat: null,
            trang_thai: null,
            tinh: null,
            dien_tich_min: null,
            dien_tich_max: null,
        };

        setFilters(resetFilters);
        fetchData();
    };

    const handleAdd = () => {
        setSelected(null);
        form.resetFields();
        setOpen(true);
    };

    const handleRowClick = async (record) => {
        const res = await getThuaDatById(record.id);

        setSelected(res);
        setDetail(res);

        form.setFieldsValue({
            so_thua: res.so_thua,
            so_to_ban_do: res.so_to_ban_do,
            loai_dat: res.loai_dat,
            dien_tich: res.dien_tich,
            trang_thai: res.trang_thai,
            tinh: res.tinh,
            dia_chi: res.dia_chi,
        });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        if (selected) {
            await updateThuaDat(selected.id, values);
        } else {
            await createThuaDat(values);
        }

        handleClose();
        fetchData();
    };

    const handlesubmitCongTrinh = async (values) => {
        try {

            if (!selected?.id) {
                return;
            }

            if (!values.chu_so_huu_id) {
                Modal.warning({
                    title: "Thiếu chủ sở hữu",
                    content: "Vui lòng tìm chủ sở hữu bằng CCCD"
                });

                return;
            }

            const payload = {
                ...values,

                // liên kết thửa đất
                thua_dat_id: selected.id,

                // ép kiểu number
                so_tang: Number(values.so_tang || 0),
                dien_tich_xay_dung: Number(values.dien_tich_xay_dung || 0),
                tong_dien_tich_san: Number(values.tong_dien_tich_san || 0),
                nam_xay_dung: values.nam_xay_dung
                    ? Number(values.nam_xay_dung)
                    : null
            };

            await createCongTrinh(payload);

            Modal.success({
                title: "Thành công",
                content: "Đã thêm công trình"
            });

            // reload detail
            const res = await getThuaDatById(selected.id);

            setDetail(res);

            // reset
            form.resetFields();

            setChuSoHuuCongTrinh(null);

            setOpenCongTrinh(false);

        } catch (err) {

            console.log(err);

            Modal.error({
                title: "Lỗi",
                content:
                    err.message ||
                    "Không thể thêm công trình"
            });
        }
    };

    const handlechuyenchuSoHuudatGiaoDich = async (values) => {
        try {
            console.log("handlechuyenchuSoHuudatGiaoDich", values);

            // TODO: implement transfer / ownership change logic

            setOpenTransfer(false);
        } catch (err) {
            console.log(err);

            Modal.error({
                title: "Lỗi",
                content:
                    err.message ||
                    "Không thể thực hiện giao dịch"
            });
        }
    };

    const columns = [
        { title: "Số thửa", dataIndex: "so_thua" },
        { title: "Số tờ", dataIndex: "so_to_ban_do" },
        { title: "Loại đất", dataIndex: "loai_dat" },
        { title: "Diện tích", dataIndex: "dien_tich" },
        { title: "Trạng thái", dataIndex: "trang_thai" },
        { title: "Tỉnh", dataIndex: "tinh" },
        { title: "Địa chỉ", dataIndex: "dia_chi" },
    ];

    const geom = parseGeom(selected?.geom);
    const firstCoord = geom?.coordinates?.[0]?.[0];

    const center =
        selected?.lat && selected?.lng
            ? [selected.lat, selected.lng]
            : firstCoord
                ? [firstCoord[1], firstCoord[0]]
                : [21.0285, 105.8542];

    const polygonPositions =
        geom?.type === "Polygon"
            ? geom.coordinates[0].map((c) => [c[1], c[0]])
            : [];

    return (
        <div style={{ padding: 24 }}>
            <h2>🏡 Quản lý thửa đất</h2>

            <Button type="primary" onClick={handleAdd}>
                + Thêm thửa đất
            </Button>

            <Input
                placeholder="🔎 CCCD chủ sở hữu"
                style={{ width: 250 }}
                allowClear
                value={filters.so_cccd}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        so_cccd: e.target.value
                    })
                }
            />

            {/* ================= FILTER ================= */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>

                {/* ================= CCCD (FIXED) ================= */}


                <Select
                    placeholder="Loại đất"
                    style={{ width: 150 }}
                    allowClear
                    value={filters.loai_dat}
                    onChange={(v) => setFilters({ ...filters, loai_dat: v })}
                    options={[
                        { value: "Đất ở", label: "Đất ở" },
                        { value: "Đất nông nghiệp", label: "Đất nông nghiệp" },
                    ]}
                />

                <Select
                    placeholder="Trạng thái"
                    style={{ width: 160 }}
                    allowClear
                    value={filters.trang_thai}
                    onChange={(v) => setFilters({ ...filters, trang_thai: v })}
                    options={[
                        { value: "dang_su_dung", label: "Đang sử dụng" },
                        { value: "chua_su_dung", label: "Chưa sử dụng" },
                        { value: "tranh_chap", label: "Tranh chấp" },
                        { value: "thu_hoi", label: "Thu hồi" },
                    ]}
                />

                <Select
                    placeholder="Tỉnh"
                    style={{ width: 150 }}
                    allowClear
                    value={filters.tinh}
                    onChange={(v) => setFilters({ ...filters, tinh: v })}
                    options={[
                        { value: "Ha Noi", label: "Hà Nội" },
                        { value: "TP HCM", label: "TP Hồ Chí Minh" },
                        { value: "Da Nang", label: "Đà Nẵng" },
                    ]}
                />

                <InputNumber
                    placeholder="Diện tích từ"
                    style={{ width: 150 }}
                    value={filters.dien_tich_min}
                    onChange={(v) => setFilters({ ...filters, dien_tich_min: v })}
                />

                <InputNumber
                    placeholder="Diện tích đến"
                    style={{ width: 150 }}
                    value={filters.dien_tich_max}
                    onChange={(v) => setFilters({ ...filters, dien_tich_max: v })}
                />

                <Button type="primary" onClick={handleSearch}>
                    🔍 Tìm kiếm
                </Button>

                <Button onClick={handleReset}>
                    Reset
                </Button>
            </div>

            <Table
                style={{ marginTop: 12 }}
                rowKey="id"
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 6 }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />

            {/* ================= MODAL ================= */}
            <Modal
                title={selected ? "Thông tin thửa đất" : "Thêm thửa đất"}
                open={open}
                onCancel={handleClose}
                onOk={() => form.submit()}
                okText={selected ? "Lưu" : "Thêm"}
                cancelText="Hủy"
                width={900}
                destroyOnClose

            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        <Form.Item name="so_thua" label="Số thửa">
                            <Input disabled={!!selected} />
                        </Form.Item>

                        <Form.Item name="so_to_ban_do" label="Số tờ bản đồ">
                            <Input disabled={!!selected} />
                        </Form.Item>

                        <Form.Item name="loai_dat" label="Loại đất">
                            <Input />
                        </Form.Item>

                        <Form.Item name="dien_tich" label="Diện tích">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item name="trang_thai" label="Trạng thái">
                            <Select
                                options={[
                                    { value: "dang_su_dung", label: "Đang sử dụng" },
                                    { value: "chua_su_dung", label: "Chưa sử dụng" },
                                    { value: "tranh_chap", label: "Tranh chấp" },
                                    { value: "thu_hoi", label: "Thu hồi" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="tinh" label="Tỉnh">
                            <Select
                                options={[
                                    { value: "Ha Noi", label: "Hà Nội" },
                                    { value: "TP HCM", label: "TP Hồ Chí Minh" },
                                    { value: "Da Nang", label: "Đà Nẵng" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="dia_chi" label="Địa chỉ">
                            <Input />
                        </Form.Item>
                    </div>
                </Form>

                {/* ================= CHỦ SỞ HỮU TABLE ================= */}\
                <div style={{ marginTop: 16 }}>
                    <h3>👤 Chủ sở hữu</h3>

                    {detail?.chu_so_huu?.length > 0 ? (
                        <Table
                            size="small"
                            pagination={false}
                            rowKey="id"
                            dataSource={detail.chu_so_huu}
                            columns={[
                                {
                                    title: "Họ tên",
                                    dataIndex: "ho_ten"
                                },
                                {
                                    title: "CCCD",
                                    dataIndex: "so_cccd"
                                },
                                {
                                    title: "Tỷ lệ",
                                    dataIndex: "ty_le_so_huu",
                                    render: (v) => `${v}%`
                                },
                                {
                                    title: "Thao tác",
                                    render: (_, record) => (
                                        <Button
                                            size="small"
                                            onClick={() => {

                                                // chủ hiện tại
                                                // setChuSoHuuCongTrinh(record);

                                                // reset form
                                                // form.resetFields();

                                                // mở modal
                                                setOpenTransfer(true);
                                            }}
                                        >
                                            🔄 Mua bán / Chuyển nhượng
                                        </Button>
                                    )
                                }
                            ]}
                        />
                    ) : (
                        <div style={{ padding: 10, color: "gray" }}>
                            ❌ Không có dữ liệu chủ sở hữu
                        </div>
                    )}
                </div>

                {/* ================= CÔNG TRÌNH TABLE ================= */}
                <div style={{ marginTop: 16 }}>
                    <h3>🏗 Công trình</h3>

                    {detail?.cong_trinh?.length > 0 ? (
                        <Table
                            size="small"
                            pagination={false}
                            rowKey="id"
                            dataSource={detail.cong_trinh}
                            columns={[
                                { title: "Tên", dataIndex: "ten_cong_trinh" },
                                { title: "Loại", dataIndex: "loai_cong_trinh" },
                                { title: "Diện tích XD", dataIndex: "dien_tich_xay_dung" },
                                { title: "Số tầng", dataIndex: "so_tang" },
                                { title: "Trạng thái", dataIndex: "trang_thai" },
                            ]}
                        />
                    ) : (
                        <div style={{ padding: 10, color: "gray" }}>
                            ❌ Không có dữ liệu công trình
                        </div>
                    )}
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                    <Button type="primary" onClick={() => setOpenCongTrinh(true)}>
                        ➕ Thêm công trình
                    </Button>

                    {/* <Button onClick={() => setOpenTransfer(true)}>
                        🔄 Mua bán / Chuyển nhượng
                    </Button> */}
                </div>

                {/* MAP */}
                <div style={{ height: 300, marginTop: 16 }}>
                    {selected ? (
                        geom ? (
                            <MapContainer
                                key={selected?.id}
                                center={center}
                                zoom={16}
                                style={{ height: "100%", width: "100%" }}
                            >

                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                <Polygon
                                    positions={geom.coordinates[0].map((c) => [
                                        c[1],
                                        c[0]
                                    ])}
                                    pathOptions={{ color: "blue" }}
                                />

                                {selected?.lat && selected?.lng && (
                                    <Marker position={[selected.lat, selected.lng]} />
                                )}
                            </MapContainer>
                        ) : (
                            <div style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "gray"
                            }}>
                                Thửa đất chưa có dữ liệu bản đồ 📍
                            </div>
                        )
                    ) : (
                        <div style={{ height: "100%" }} />
                    )}
                </div>

            </Modal >
            <Modal
                title="Thêm công trình"
                open={openCongTrinh}
                onCancel={() => setOpenCongTrinh(false)}
                width={1100}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handlesubmitCongTrinh}>

                    {/* ================= THÔNG TIN CÔNG TRÌNH ================= */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 12
                        }}
                    >
                        <Form.Item name="ten_cong_trinh" label="Tên công trình">
                            <Input placeholder="Tên công trình..." />
                        </Form.Item>

                        <Form.Item name="loai_cong_trinh" label="Loại công trình">
                            <Select
                                placeholder="Chọn loại"
                                options={[
                                    { value: "Nhà ở", label: "Nhà ở" },
                                    { value: "Cao ốc", label: "Cao ốc" },
                                    { value: "Nhà xưởng", label: "Nhà xưởng" },
                                    { value: "Kho chứa", label: "Kho chứa" }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="so_tang" label="Số tầng">
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                            />
                        </Form.Item>

                        <Form.Item name="ket_cau" label="Kết cấu">
                            <Input placeholder="BTCT / Gạch / Thép..." />
                        </Form.Item>

                        <Form.Item
                            name="dien_tich_xay_dung"
                            label="Diện tích xây dựng (m²)"
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                            name="tong_dien_tich_san"
                            label="Tổng diện tích sàn (m²)"
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item name="cap_hang" label="Cấp hạng">
                            <Input placeholder="A / B / C..." />
                        </Form.Item>

                        <Form.Item
                            name="hinh_thuc_so_huu"
                            label="Hình thức sở hữu"
                        >
                            <Input placeholder="Riêng / Chung..." />
                        </Form.Item>

                        <Form.Item name="nam_xay_dung" label="Năm xây dựng">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                            name="thoi_han_su_dung"
                            label="Thời hạn sử dụng"
                        >
                            <Input placeholder="50 năm / vĩnh viễn..." />
                        </Form.Item>

                        <Form.Item name="trang_thai" label="Trạng thái">
                            <Select
                                placeholder="Chọn trạng thái"
                                options={[
                                    {
                                        value: "dang_su_dung",
                                        label: "🟢 Đang sử dụng"
                                    },
                                    {
                                        value: "dang_xay_dung",
                                        label: "🟡 Đang xây dựng"
                                    },
                                    {
                                        value: "hoan_thanh",
                                        label: "🔵 Hoàn thành"
                                    },
                                    {
                                        value: "ngung_thi_cong",
                                        label: "🔴 Ngưng thi công"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </div>

                    {/* ================= SEARCH CCCD ================= */}
                    <div
                        style={{
                            marginTop: 20,
                            padding: 16,
                            border: "1px solid #f0f0f0",
                            borderRadius: 8,
                            background: "#fafafa"
                        }}
                    >
                        <h3 style={{ marginBottom: 12 }}>
                            👤 Tìm chủ sở hữu bằng CCCD
                        </h3>

                        <Input
                            placeholder="Nhập CCCD chủ sở hữu..."
                            allowClear
                            style={{ width: 300 }}
                            onChange={(e) => {
                                const value = e.target.value?.trim();

                                if (value.length >= 9) {
                                    handleSearchCCCDCongTrinh(value);
                                }

                                if (!value) {
                                    setChuSoHuuCongTrinh(null);

                                    form.setFieldsValue({
                                        chu_so_huu_id: null
                                    });
                                }
                            }}
                        />

                        <Form.Item name="chu_so_huu_id" hidden>
                            <Input />
                        </Form.Item>

                        {/* ================= TABLE CHỦ SỞ HỮU ================= */}
                        <div style={{ marginTop: 16 }}>
                            <Table
                                size="small"
                                pagination={false}
                                rowKey="id"
                                locale={{
                                    emptyText: "Chưa tìm thấy chủ sở hữu"
                                }}
                                dataSource={
                                    chuSoHuuCongTrinh
                                        ? [chuSoHuuCongTrinh]
                                        : []
                                }
                                columns={[
                                    {
                                        title: "Họ tên",
                                        dataIndex: "ho_ten"
                                    },
                                    {
                                        title: "CCCD",
                                        dataIndex: "so_cccd"
                                    },
                                    {
                                        title: "SĐT",
                                        dataIndex: "so_dien_thoai"
                                    },
                                    {
                                        title: "Địa chỉ",
                                        dataIndex: "dia_chi"
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    {/* ================= ACTION ================= */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 10,
                            marginTop: 24
                        }}
                    >
                        <Button onClick={() => setOpenCongTrinh(false)}>
                            Hủy
                        </Button>

                        <Button type="primary" htmlType="submit">
                            Lưu công trình
                        </Button>
                    </div>

                </Form>

                {/* ================= MAP ================= */}
                {/* <div style={{ height: 320, marginTop: 16 }}>
                    {point ? (
                        <MapContainer
                            key={point.join(",")}
                            center={point}
                            zoom={16}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <MapFix />
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={point} />
                        </MapContainer>
                    ) : (
                        <div style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "gray"
                        }}>
                            Chưa có vị trí 📍
                        </div>
                    )}
                </div> */}
            </Modal>
            <Modal
                title="Mua bán / Chuyển nhượng tài sản"
                open={openTransfer}
                onCancel={() => setOpenTransfer(false)}
                footer={null}
                width={900}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlechuyenchuSoHuudatGiaoDich}
                >

                    {/* ================= THÔNG TIN GIAO DỊCH ================= */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16
                        }}
                    >
                        <Form.Item
                            name="loai_giao_dich"
                            label="Loại giao dịch"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại giao dịch"
                                }
                            ]}
                        >
                            <Select
                                placeholder="Chọn loại giao dịch"
                                options={[
                                    {
                                        value: "mua_ban",
                                        label: "💰 Mua bán"
                                    },
                                    {
                                        value: "chuyen_nhuong",
                                        label: "🔄 Chuyển nhượng"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </div>

                    {/* ================= CHỦ MỚI ================= */}
                    <div
                        style={{
                            marginTop: 20,
                            padding: 16,
                            border: "1px solid #f0f0f0",
                            borderRadius: 8,
                            background: "#fafafa"
                        }}
                    >
                        <h3 style={{ marginBottom: 12 }}>
                            👤 Tìm chủ sở hữu mới bằng CCCD
                        </h3>

                        <Input
                            placeholder="Nhập CCCD..."
                            allowClear
                            style={{ width: 300 }}
                            onChange={(e) => {

                                const value = e.target.value?.trim();

                                if (value?.length >= 9) {
                                    handleSearchCCCDCongTrinh(value);
                                }

                                if (!value) {

                                    setChuSoHuuCongTrinh(null);

                                    form.setFieldsValue({
                                        chu_so_huu_id: null
                                    });
                                }
                            }}
                        />

                        <Form.Item
                            name="chu_so_huu_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        {/* ================= TABLE ================= */}
                        <div style={{ marginTop: 16 }}>
                            <Table
                                size="small"
                                pagination={false}
                                rowKey="id"
                                bordered
                                locale={{
                                    emptyText: "Chưa tìm thấy chủ sở hữu"
                                }}
                                dataSource={
                                    chuSoHuuCongTrinh
                                        ? [chuSoHuuCongTrinh]
                                        : []
                                }
                                columns={[
                                    {
                                        title: "Họ tên",
                                        dataIndex: "ho_ten"
                                    },
                                    {
                                        title: "CCCD",
                                        dataIndex: "so_cccd"
                                    },
                                    {
                                        title: "SĐT",
                                        dataIndex: "so_dien_thoai"
                                    },
                                    {
                                        title: "Địa chỉ",
                                        dataIndex: "dia_chi"
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    {/* ================= GHI CHÚ ================= */}
                    <Form.Item
                        name="ghi_chu"
                        label="Ghi chú"
                        style={{ marginTop: 20 }}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập ghi chú giao dịch..."
                        />
                    </Form.Item>

                    {/* ================= ACTION ================= */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 10
                        }}
                    >
                        <Button
                            onClick={() => setOpenTransfer(false)}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Xác nhận giao dịch
                        </Button>
                    </div>

                </Form>
            </Modal>
        </div >
    );
}