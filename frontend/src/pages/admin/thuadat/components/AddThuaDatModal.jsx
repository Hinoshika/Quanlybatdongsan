import { Modal, Form, Input, InputNumber, Select, Row, Col } from "antd";
import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix icon leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 👉 VẼ POLYGON
function PolygonDrawer({ form }) {
    const [points, setPoints] = useState([]);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const newPoints = [...points, [lat, lng]];

            setPoints(newPoints);
            form.setFieldsValue({ polygon: newPoints });
        },

        dblclick() {
            setPoints([]);
            form.setFieldsValue({ polygon: [] });
        }
    });

    return points.length >= 3 ? (
        <Polygon positions={points} pathOptions={{ color: "blue" }} />
    ) : null;
}

export default function AddThuaDatModal({
    open,
    onClose,
    onSubmit
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) form.resetFields();
    }, [open]);

    const handleFinish = (values) => {
        // 👉 đảm bảo không bị null dia_chi
        const payload = {
            ...values,
            dia_chi: values.dia_chi || values.tinh || "Chưa cập nhật",
            polygon: values.polygon || []
        };

        onSubmit(payload);
    };

    return (
        <Modal
            title="➕ Thêm thửa đất"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Lưu"
            cancelText="Huỷ"
            width={900}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>

                {/* ROW 1 */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Số thửa"
                            name="so_thua"
                            rules={[{ required: true, message: "Nhập số thửa" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Số tờ bản đồ" name="so_to_ban_do">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Loại đất" name="loai_dat">
                            <Select options={[
                                { value: "dat_o", label: "Đất ở" },
                                { value: "dat_nong_nghiep", label: "Đất nông nghiệp" },
                                { value: "dat_thuong_mai", label: "Đất thương mại" }
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ROW 2 */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Diện tích (m²)" name="dien_tich">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Tỉnh / Thành phố" name="tinh">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Địa chỉ" name="dia_chi">
                            <Input placeholder="VD: Hoàn Kiếm, Hà Nội" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ROW 3 */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Trạng thái" name="trang_thai">
                            <Select options={[
                                { value: "dang_su_dung", label: "Đang sử dụng" },
                                { value: "tranh_chap", label: "Tranh chấp" },
                                { value: "chuyen_nhuong", label: "Đã chuyển nhượng" }
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* MAP */}
                <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>
                        Click để vẽ ranh giới thửa đất (Polygon)
                    </div>

                    <MapContainer
                        center={[21.0285, 105.8542]}
                        zoom={13}
                        style={{ height: 320, width: "100%", borderRadius: 8 }}
                        doubleClickZoom={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <PolygonDrawer form={form} />
                    </MapContainer>
                </div>

                {/* hidden data */}
                <Form.Item name="polygon" hidden>
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
}