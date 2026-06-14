import { useState } from "react";
import { Drawer, Card, Table, Input, Button, Tag, Form, InputNumber, message, Row, Col } from "antd";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { searchByCCCD, deleteThuaDat } from "../../../../services/thuaDat.service";
import { useWatch } from "antd/es/form/Form";
// ================= FLY TO =================
function FlyToPolygon({ item }) {
    const map = useMap();
    if (item?.geom?.coordinates?.[0]) {
        const coords = item.geom.coordinates[0].map(c => [c[1], c[0]]);
        const lat = coords.map(c => c[0]);
        const lng = coords.map(c => c[1]);
        const center = [
            lat.reduce((a, b) => a + b, 0) / lat.length,
            lng.reduce((a, b) => a + b, 0) / lng.length
        ];
        map.flyTo(center, 17);
    }
    return null;
}
// ================= MAIN =================
export default function TachThuaDrawer({ open, onClose, onSubmit }) {
    const [form] = Form.useForm();
    const [cccd, setCccd] = useState("");
    const [result, setResult] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [splitPolygons, setSplitPolygons] = useState([]);
    // ================= SEARCH =================
    const handleSearch = async () => {
        if (!cccd.trim()) {
            return message.warning("Nhập CCCD");
        }
        try {
            const res = await searchByCCCD(cccd.trim());
            setResult(res || []);
            setSelectedItem(null);
        } catch {
            message.error("Không tìm thấy dữ liệu");
        }
    };
    // ================= SELECT =================
    const handleSelect = (item) => {
        setSelectedItem(item);

        form.setFieldsValue({
            thua_con: [
                {
                    so_thua_moi: "",
                    dien_tich: item.dien_tich / 2,
                    coordinates: [
                        { lng: null, lat: null },
                        { lng: null, lat: null },
                        { lng: null, lat: null }
                    ]
                },
                {
                    so_thua_moi: "",
                    dien_tich: item.dien_tich / 2,
                    coordinates: [
                        { lng: null, lat: null },
                        { lng: null, lat: null },
                        { lng: null, lat: null }
                    ]
                }
            ]
        });
    };
    const thuaConWatch = useWatch("thua_con", form);
    const previewPolygons = (thuaConWatch || [])
        .map(item => {
            const coords = (item?.coordinates || [])
                .filter(p => p?.lng != null && p?.lat != null)
                .map(p => [Number(p.lat), Number(p.lng)])

            if (coords.length < 3) return null;

            return {
                ...item,
                coordinates: coords
            };
        })
        .filter(Boolean);

    const parseCoordinates = (text) => {
        if (!text) return [];

        return text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const [lng, lat] = line.split(",");

                return [
                    Number(lng),
                    Number(lat)
                ];
            });
    };
    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        if (!selectedItem) {
            return message.error("Chọn thửa");
        }

        try {
            setLoading(true);

            const thuaCon = values.thua_con.map(item => {

                const coords = (item.coordinates || [])
                    .filter(p => p?.lng != null && p?.lat != null)
                    .map(p => [Number(p.lng), Number(p.lat)]);

                if (coords.length < 3) {
                    throw new Error(
                        `Thửa ${item.so_thua_moi || ""} phải có ít nhất 3 điểm`
                    );
                }

                const uniqueCoords = [
                    ...new Map(coords.map(p => p.toString())).values()
                ];

                uniqueCoords.push(uniqueCoords[0]); // đóng polygon

                return {
                    so_thua_moi: item.so_thua_moi,
                    dien_tich: item.dien_tich,
                    coordinates: uniqueCoords
                };
            });

            const success = await onSubmit?.({
                thua_dat_id: selectedItem.id,
                thua_con: thuaCon
            });

            if (!success) return;

            setSplitPolygons(thuaCon);

            message.success(`Tách thành ${thuaCon.length} thửa`);

            form.resetFields();
            setSelectedItem(null);
            setResult([]);
            setCccd("");

            onClose();

        } catch (err) {
            message.error(err.message || "Tách thửa thất bại");
        } finally {
            setLoading(false);
        }
    };
    // ================= GEOM =================
    const polygonPositions = selectedItem?.geom?.coordinates?.[0]
        ? selectedItem.geom.coordinates[0].map(c => [c[1], c[0]])
        : [];
    return (
        <Drawer
            title="✂️ Tách thửa đất"
            open={open}
            width={1200}
            onClose={onClose}
        >
            {/* ================= SEARCH + TABLE ================= */}
            <Card>
                <Input
                    placeholder="Nhập CCCD"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                />
                <Button
                    type="primary"
                    block
                    onClick={handleSearch}
                    style={{ marginTop: 10 }}
                >
                    Tìm kiếm
                </Button>
                <Table
                    style={{ marginTop: 10 }}
                    rowKey="id"
                    dataSource={result}
                    pagination={false}
                    size="small"
                    onRow={(record) => ({
                        onClick: () => handleSelect(record)
                    })}
                    columns={[
                        { title: "Số thửa", dataIndex: "so_thua" },
                        { title: "Tờ", dataIndex: "so_to_ban_do" },
                        { title: "DT", dataIndex: "dien_tich" }
                    ]}
                />
                {selectedItem && (
                    <div style={{ marginTop: 10 }}>
                        <Tag color="blue">
                            Thửa: {selectedItem.so_thua}
                        </Tag>
                        <Tag color="green">
                            {selectedItem.dien_tich} m²
                        </Tag>
                    </div>
                )}
            </Card>
            {/* ================= FORM THỬA CON ================= */}
            <Card style={{ marginTop: 15 }} title="✏️ Thông tin thửa con">

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.List name="thua_con">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Card
                                        key={field.key}
                                        size="small"
                                        style={{ marginBottom: 10 }}
                                        title={`Thửa con ${index + 1}`}
                                        extra={
                                            <Button danger onClick={() => remove(field.name)}
                                            >
                                                Xóa
                                            </Button>
                                        }
                                    >
                                        <Form.Item
                                            label="Số thửa mới"
                                            name={[field.name, "so_thua_moi"]}
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Diện tích (m²)"
                                            name={[field.name, "dien_tich"]}
                                            rules={[{ required: true }]}
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                min={0}
                                            />
                                        </Form.Item>
                                        <Form.List name={[field.name, "coordinates"]}>
                                            {(coordFields, { add: addPoint, remove: removePoint }) => (
                                                <>
                                                    {coordFields.map((coordField, idx) => (
                                                        <Card
                                                            key={coordField.key}
                                                            size="small"
                                                            style={{
                                                                marginBottom: 8,
                                                                background: "#fafafa"
                                                            }}
                                                            title={`Điểm ${idx + 1}`}
                                                            extra={
                                                                <Button
                                                                    danger
                                                                    size="small"
                                                                    onClick={() =>
                                                                        removePoint(coordField.name)
                                                                    }
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            }
                                                        >
                                                            <Row gutter={10}>
                                                                <Col span={12}>
                                                                    <Form.Item
                                                                        label="Kinh độ (Lng)"
                                                                        name={[
                                                                            coordField.name,
                                                                            "lng"
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: "Nhập kinh độ"
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <InputNumber
                                                                            style={{ width: "100%" }}
                                                                            step={0.000001}
                                                                            placeholder="105.8542"
                                                                        />
                                                                    </Form.Item>
                                                                </Col>

                                                                <Col span={12}>
                                                                    <Form.Item
                                                                        label="Vĩ độ (Lat)"
                                                                        name={[
                                                                            coordField.name,
                                                                            "lat"
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: "Nhập vĩ độ"
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <InputNumber
                                                                            style={{ width: "100%" }}
                                                                            step={0.000001}
                                                                            placeholder="21.0285"
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    ))}

                                                    <Button
                                                        block
                                                        type="dashed"
                                                        onClick={() =>
                                                            addPoint({
                                                                lng: null,
                                                                lat: null
                                                            })
                                                        }
                                                    >
                                                        + Thêm điểm tọa độ
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </Card>
                                ))}

                                <Button
                                    type="dashed"
                                    block
                                    onClick={() =>
                                        add({ so_thua_moi: "", dien_tich: 0 })
                                    }
                                >
                                    + Thêm thửa con
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    style={{ marginTop: 10 }}
                                >
                                    ✂️ Tách thửa
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
            {/* ================= MAP ================= */}
            <Card
                title="🗺️ Bản đồ thửa đất"
                style={{ marginTop: 15 }}
                bodyStyle={{ padding: 0 }}
            >
                <MapContainer
                    center={[21.0285, 105.8542]}
                    zoom={15}
                    style={{ height: 350, width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {selectedItem && (
                        <FlyToPolygon item={selectedItem} />
                    )}
                    {selectedItem && (
                        <Polygon
                            positions={polygonPositions}
                            pathOptions={{
                                color: "red",
                                fillColor: "#ff4d4f",
                                fillOpacity: 0.4
                            }}
                        >
                            <Popup>
                                <b>Thửa {selectedItem.so_thua}</b>
                                <br />
                                {selectedItem.dien_tich} m²
                            </Popup>
                        </Polygon>
                    )}
                    {previewPolygons.map((p, idx) => (
                        <Polygon
                            key={idx}
                            positions={p.coordinates}
                            pathOptions={{
                                color: "green",
                                fillColor: "#52c41a",
                                fillOpacity: 0.4
                            }}
                        >
                            <Popup>
                                Thửa con {idx + 1}
                                <br />
                                {p.dien_tich} m²
                            </Popup>
                        </Polygon>
                    ))}
                </MapContainer>
            </Card>

        </Drawer>
    );
}