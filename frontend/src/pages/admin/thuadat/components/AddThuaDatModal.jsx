import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Row,
    Col,
    Button
} from "antd";

import { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Polygon
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

export default function AddThuaDatModal({
    open,
    onClose,
    onSubmit
}) {
    const [form] = Form.useForm();

    const [coordinates, setCoordinates] = useState([
        { lat: "", lng: "" }
    ]);

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setCoordinates([{ lat: "", lng: "" }]);
        }
    }, [open]);

    const updatePolygonField = (coords) => {
        const polygon = coords
            .filter(
                (p) =>
                    p.lat !== "" &&
                    p.lng !== ""
            )
            .map((p) => [
                Number(p.lat),
                Number(p.lng)
            ]);

        form.setFieldsValue({
            polygon
        });
    };

    const addPoint = () => {
        const newCoords = [
            ...coordinates,
            { lat: "", lng: "" }
        ];

        setCoordinates(newCoords);
    };

    const removePoint = (index) => {
        const newCoords = coordinates.filter(
            (_, i) => i !== index
        );

        setCoordinates(newCoords);
        updatePolygonField(newCoords);
    };

    const updatePoint = (
        index,
        field,
        value
    ) => {
        const newCoords = [...coordinates];

        newCoords[index][field] = value;

        setCoordinates(newCoords);
        updatePolygonField(newCoords);
    };

    const polygonPoints = coordinates
        .filter(
            (p) =>
                p.lat !== "" &&
                p.lng !== ""
        )
        .map((p) => [
            Number(p.lat),
            Number(p.lng)
        ]);

    const handleFinish = (values) => {
        const payload = {
            ...values,
            dia_chi:
                values.dia_chi ||
                values.tinh ||
                "Chưa cập nhật",
            polygon:
                values.polygon || []
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
            width={1000}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Số thửa"
                            name="so_thua"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Nhập số thửa"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Số tờ bản đồ"
                            name="so_to_ban_do"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Loại đất"
                            name="loai_dat"
                        >
                            <Select
                                options={[
                                    { value: "Đất ở", label: "Đất ở" },
                                    { value: "Đất nông nghiệp", label: "Đất nông nghiệp" },
                                    { value: "Đất thương mại", label: "Đất thương mại" },
                                    { value: "Đất xây dựng trụ sở cơ quan", label: "Đất xây dựng trụ sở cơ quan." },
                                    { value: "Đất quốc phòng, an ninh", label: "Đất quốc phòng, an ninh." },
                                    { value: "Đất xây dựng công trình sự nghiệp", label: "Đất xây dựng công trình sự nghiệp" },
                                    { value: "Đất sử dụng cho mục đích công cộng", label: "Đất sử dụng cho mục đích công cộng" },
                                    { value: "Đất sản xuất, kinh doanh phi nông nghiệp", label: "Đất sản xuất, kinh doanh phi nông nghiệp" },
                                    { value: "Đất lâm nghiệp", label: "Đất lâm nghiệp" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Diện tích (m²)"
                            name="dien_tich"
                        >
                            <InputNumber
                                style={{
                                    width: "100%"
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="tinh"
                            label="Tỉnh"
                            rules={[{ required: true }]}
                        >
                            <Select options={[
                                { value: "TP Hà Nội", label: "TPHà Nội" },
                                { value: "TP HCM", label: "TP Hồ Chí Minh" },
                                { value: "TP Đà Nẵng", label: "TP Đà Nẵng" },
                                { value: "TP. Hải Phòng", label: "TP. Hải Phòng" },
                                { value: "TP HCM", label: "TP Hồ Chí Minh" },
                                { value: "TP. Cần Thơ", label: "TP. Cần Thơ" },
                                { value: "TP. Huế", label: "TP. Huế" },
                                { value: "Tuyên Quang", label: "Tuyên Quang" },
                                { value: "Lào Cai", label: "Lào Cai" },
                            ]} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Địa chỉ"
                            name="dia_chi"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Trạng thái"
                            name="trang_thai"
                        >
                            <Select
                                options={[
                                    { value: "Đang sử dụng", label: "Đang sử dụng" },
                                    { value: "Chưa sử dụng", label: "Chưa sử dụng" },
                                    { value: "Tranh chấp", label: "Tranh chấp" },
                                    { value: "Thu hồi", label: "Thu hồi" }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div
                    style={{
                        marginBottom: 20
                    }}
                >
                    <h3>
                        Tọa độ ranh giới
                    </h3>

                    {coordinates.map(
                        (
                            point,
                            index
                        ) => (
                            <Row
                                gutter={8}
                                key={
                                    index
                                }
                                style={{
                                    marginBottom: 8
                                }}
                            >
                                <Col span={10}>
                                    <Input
                                        type="number"
                                        placeholder="Vĩ độ (Lat)"
                                        value={point.lat}
                                        onChange={(e) =>
                                            updatePoint(index, "lat", e.target.value)
                                        }
                                    />
                                </Col>

                                <Col span={10}>
                                    <Input
                                        type="number"
                                        placeholder="Kinh độ (Lng)"
                                        value={point.lng}
                                        onChange={(e) =>
                                            updatePoint(index, "lng", e.target.value)
                                        }
                                    />
                                </Col>

                                <Col span={4}>
                                    <Button
                                        danger
                                        onClick={() =>
                                            removePoint(
                                                index
                                            )
                                        }
                                    >
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        )
                    )}

                    <Button
                        type="dashed"
                        onClick={
                            addPoint
                        }
                    >
                        + Thêm điểm
                    </Button>
                </div>

                <MapContainer
                    center={[
                        21.0285,
                        105.8542
                    ]}
                    zoom={14}
                    style={{
                        height: 350,
                        width: "100%"
                    }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {polygonPoints.length >=
                        3 && (
                            <Polygon
                                positions={
                                    polygonPoints
                                }
                                pathOptions={{
                                    color:
                                        "blue"
                                }}
                            />
                        )}
                </MapContainer>

                <Form.Item
                    name="polygon"
                    hidden
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}