import {
    Drawer, Button, message, Card, Tag, Row, Col, Table, Input, Modal
} from "antd";

import { useState, useMemo } from "react";

import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    useMap
} from "react-leaflet";

import { searchByCCCD } from "../../../../services/thuaDat.service";
import "leaflet/dist/leaflet.css";

// ================= MAP FLY =================
function MapFlyTo({ target }) {
    const map = useMap();

    useMemo(() => {
        if (target) map.flyTo(target, 17);
    }, [target, map]);

    return null;
}

// ================= MAIN =================
export default function GopThuaDrawer({ open, onClose, onSubmit }) {

    const [cccd, setCccd] = useState("");
    const [result, setResult] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [marker, setMarker] = useState(null);

    // ================= SEARCH =================
    const handleSearch = async () => {
        if (!cccd.trim()) return message.warning("Nhập CCCD");

        try {
            const res = await searchByCCCD(cccd.trim());

            setResult(res || []);
            setSelectedIds([]);
            setMarker(null);

        } catch {
            message.error("Lỗi tìm kiếm");
        }
    };

    // ================= SELECT =================
    const handleSelect = (keys) => {
        setSelectedIds(keys);

        const first = result.find(i => i.id === keys?.[0]);
        if (!first?.geom?.coordinates?.[0]) return;

        const coords = first.geom.coordinates[0];

        const lat = coords.map(c => c[1]);
        const lng = coords.map(c => c[0]);

        setMarker([
            lat.reduce((a, b) => a + b, 0) / lat.length,
            lng.reduce((a, b) => a + b, 0) / lng.length
        ]);
    };

    // ================= VALID MERGE =================
    const selectedData = useMemo(() =>
        result.filter(i => selectedIds.includes(i.id)),
        [result, selectedIds]
    );

    const totalArea = useMemo(() =>
        selectedData.reduce((s, i) => s + Number(i.dien_tich || 0), 0),
        [selectedData]
    );

    const isValidMerge = selectedData.length >= 2;

    // ================= MERGE =================
    const handleMerge = () => {
        if (!isValidMerge)
            return message.error("Chọn ít nhất 2 thửa");

        Modal.confirm({
            title: "Gộp thửa",
            content: "Tạo thửa mới từ các thửa đã chọn",

            async onOk() {
                await onSubmit({
                    type: "MERGE",
                    thua_ids: selectedIds
                });

                message.success("Gộp thành công");

                setResult([]);
                setSelectedIds([]);
                setCccd("");
                onClose();
            }
        });
    };

    // ================= COLUMNS =================
    const columns = [
        { title: "Số thửa", dataIndex: "so_thua", width: 100 },
        { title: "Số tờ", dataIndex: "so_to_ban_do", width: 100 },
        { title: "Địa chỉ", dataIndex: "dia_chi", width: 220, ellipsis: true },
        { title: "Tỉnh", dataIndex: "tinh", width: 120 },
        { title: "Diện tích", dataIndex: "dien_tich", width: 120 },
        { title: "Loại đất", dataIndex: "loai_dat", width: 140 },
        { title: "Mục đích", dataIndex: "muc_dich_su_dung", width: 160 },
        { title: "Hình thức", dataIndex: "hinh_thuc_su_dung", width: 170 },
        { title: "Thời hạn", dataIndex: "thoi_han_su_dung", width: 150 },
        { title: "Nguồn gốc", dataIndex: "nguon_goc_su_dung", width: 170 },

        {
            title: "Trạng thái",
            dataIndex: "trang_thai",
            width: 140,
            render: (v) => {
                let color = "green";
                if (v === "thế_chấp") color = "orange";
                if (v === "tranh_chấp") color = "red";
                if (v === "dang_su_dung") color = "blue";

                return <Tag color={color}>{v}</Tag>;
            }
        },
    ];

    return (
        <Drawer
            title="🔗 Gộp thửa đất"
            width={1400}
            open={open}
            onClose={onClose}
        >

            <Row gutter={16}>

                {/* ================= LEFT ================= */}
                <Col span={16}>
                    <Card>

                        <Input
                            placeholder="Nhập CCCD"
                            value={cccd}
                            onChange={e => setCccd(e.target.value)}
                        />

                        <Button
                            type="primary"
                            block
                            style={{ marginTop: 8 }}
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>

                        {/* ================= STATS ================= */}
                        <div style={{ marginTop: 12 }}>
                            <Tag>Chọn: {selectedIds.length}</Tag>
                            <Tag color="blue">DT: {totalArea} m²</Tag>
                            {/* <Tag color={isValidMerge ? "green" : "red"}>
                                {isValidMerge ? "OK" : "INVALID"}
                            </Tag> */}
                        </div>

                        <Button
                            danger
                            block
                            style={{ marginTop: 12 }}
                            onClick={handleMerge}
                        >
                            🔗 Gộp thửa
                        </Button>

                        {/* ================= TABLE ================= */}
                        <Table
                            rowKey="id"
                            size="small"
                            dataSource={result}   // ✅ dùng trực tiếp backend trả về
                            columns={columns}
                            pagination={false}
                            scroll={{ x: 2600, y: 420 }}
                            rowSelection={{
                                selectedRowKeys: selectedIds,
                                onChange: handleSelect
                            }}
                        />
                    </Card>
                </Col>

                {/* ================= MAP ================= */}
                <Col span={8}>
                    <Card title="🗺️ Map" bodyStyle={{ padding: 0 }}>
                        <MapContainer
                            center={[21.0285, 105.8542]}
                            zoom={15}
                            style={{ height: 650 }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <MapFlyTo target={marker} />

                            {selectedData.map(item => {
                                const coords = item.geom?.coordinates?.[0];
                                if (!coords) return null;

                                const positions = coords.map(c => [c[1], c[0]]);

                                return (
                                    <Polygon
                                        key={item.id}
                                        positions={positions}
                                        pathOptions={{ color: "red", fillOpacity: 0.4 }}
                                    >
                                        <Popup>
                                            <b>{item.so_thua}</b>
                                            <br />
                                            {item.dia_chi}
                                        </Popup>
                                    </Polygon>
                                );
                            })}
                        </MapContainer>
                    </Card>
                </Col>

            </Row>
        </Drawer>
    );
}