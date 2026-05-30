import { useState, useEffect } from "react";

import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Table,
    Space,
    message
} from "antd";

import {
    MapContainer,
    TileLayer,
    Polygon,
    Marker,
    useMap,
    useMapEvents
} from "react-leaflet";

import {
    parseGeom,
    getPolygonPositions
} from "../utils/geometry";

function LocationPicker({ onSelect }) {

    useMapEvents({
        click(e) {

            onSelect([
                e.latlng.lat,
                e.latlng.lng
            ]);
        }
    });

    return null;
}

// ================= FIT POLYGON =================

function FitBounds({ positions }) {

    const map = useMap();

    useEffect(() => {

        if (positions?.length) {

            map.fitBounds(positions, {
                padding: [30, 30]
            });
        }

    }, [positions, map]);

    return null;
}

export default function CongTrinhModal({
    open,
    onClose,
    onSubmit,
    onSearchCCCD,
    chuSoHuuCongTrinh,
    selected
}) {

    const [form] = Form.useForm();

    const [point, setPoint] = useState(null);

    // ================= DANH SÁCH CHỦ SỞ HỮU =================

    const [owners, setOwners] = useState([]);

    const geom = parseGeom(selected?.geom);

    const polygonPositions = getPolygonPositions(geom);

    // ================= CHỌN VỊ TRÍ =================

    const handleSelectPoint = (latlng) => {

        setPoint(latlng);

        form.setFieldsValue({
            lat: latlng[0],
            lng: latlng[1]
        });
    };

    // ================= THÊM CHỦ SỞ HỮU =================

    const handleAddOwner = () => {

        if (!chuSoHuuCongTrinh) {
            return message.warning("Chưa tìm thấy chủ sở hữu");
        }

        const exists = owners.find(
            item => item.id === chuSoHuuCongTrinh.id
        );

        if (exists) {
            return message.warning("Chủ sở hữu đã tồn tại");
        }

        setOwners([
            ...owners,
            {
                ...chuSoHuuCongTrinh,
                ty_le_so_huu: 100
            }
        ]);
    };

    // ================= XÓA OWNER =================

    const handleRemoveOwner = (id) => {

        setOwners(
            owners.filter(item => item.id !== id)
        );
    };

    // ================= UPDATE TỶ LỆ =================

    const handleChangePercent = (index, value) => {

        const clone = [...owners];

        clone[index].ty_le_so_huu = value;

        setOwners(clone);
    };

    // ================= SUBMIT =================

    const handleFinish = (values) => {

        const total = owners.reduce(
            (sum, item) => sum + Number(item.ty_le_so_huu || 0),
            0
        );

        if (owners.length === 0) {
            return message.warning("Phải có ít nhất 1 chủ sở hữu");
        }

        if (total !== 100) {
            return message.error(
                `Tổng tỷ lệ sở hữu phải bằng 100% (hiện tại ${total}%)`
            );
        }

        const payload = {

            ...values,

            owners: owners.map(item => ({
                chu_so_huu_id: item.id,
                ty_le_so_huu: item.ty_le_so_huu
            }))
        };

        onSubmit(payload);
    };

    return (
        <Modal
            title="Thêm công trình"
            open={open}
            onCancel={onClose}
            width={1100}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >

                {/* ================= THÔNG TIN CÔNG TRÌNH ================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12
                    }}
                >

                    <Form.Item
                        name="ten_cong_trinh"
                        label="Tên công trình"
                    >
                        <Input placeholder="Tên công trình..." />
                    </Form.Item>

                    <Form.Item
                        name="loai_cong_trinh"
                        label="Loại công trình"
                    >
                        <Select
                            placeholder="Chọn loại"
                            options={[
                                {
                                    value: "Nhà ở",
                                    label: "Nhà ở"
                                },
                                {
                                    value: "Cao ốc",
                                    label: "Cao ốc"
                                },
                                {
                                    value: "Nhà xưởng",
                                    label: "Nhà xưởng"
                                },
                                {
                                    value: "Kho chứa",
                                    label: "Kho chứa"
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="so_tang"
                        label="Số tầng"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="ket_cau"
                        label="Kết cấu"
                    >
                        <Input placeholder="BTCT / Gạch / Thép..." />
                    </Form.Item>

                    <Form.Item
                        name="dien_tich_xay_dung"
                        label="Diện tích xây dựng"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="tong_dien_tich_san"
                        label="Tổng diện tích sàn"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="lat"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="lng"
                        hidden
                    >
                        <Input />
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

                    <h3>
                        👤 Thêm chủ sở hữu
                    </h3>

                    <Space>

                        <Input
                            placeholder="Nhập CCCD..."
                            allowClear
                            style={{ width: 300 }}
                            onChange={(e) => {

                                const value =
                                    e.target.value?.trim();

                                if (value?.length >= 9) {
                                    onSearchCCCD(value);
                                }
                            }}
                        />

                        <Button
                            type="primary"
                            onClick={handleAddOwner}
                        >
                            Thêm
                        </Button>

                    </Space>

                    {/* ================= TABLE SEARCH ================= */}

                    <div style={{ marginTop: 16 }}>

                        <Table
                            size="small"
                            pagination={false}
                            rowKey="id"
                            locale={{
                                emptyText:
                                    "Chưa tìm thấy chủ sở hữu"
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
                                }
                            ]}
                        />

                    </div>

                </div>

                {/* ================= DANH SÁCH OWNER ================= */}

                <div style={{ marginTop: 24 }}>

                    <h3>
                        🏠 Danh sách chủ sở hữu
                    </h3>

                    <Table
                        rowKey="id"
                        pagination={false}
                        dataSource={owners}
                        locale={{
                            emptyText:
                                "Chưa có chủ sở hữu"
                        }}
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
                                title: "Tỷ lệ sở hữu (%)",
                                render: (_, record, index) => (
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        value={
                                            record.ty_le_so_huu
                                        }
                                        onChange={(value) =>
                                            handleChangePercent(
                                                index,
                                                value
                                            )
                                        }
                                    />
                                )
                            },
                            {
                                title: "Thao tác",
                                render: (_, record) => (
                                    <Button
                                        danger
                                        onClick={() =>
                                            handleRemoveOwner(
                                                record.id
                                            )
                                        }
                                    >
                                        Xóa
                                    </Button>
                                )
                            }
                        ]}
                    />

                </div>

                {/* ================= MAP ================= */}

                <div
                    style={{
                        height: 400,
                        marginTop: 20,
                        borderRadius: 8,
                        overflow: "hidden"
                    }}
                >

                    {geom ? (

                        <MapContainer
                            scrollWheelZoom={true}
                            zoomControl={true}
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                        >

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <FitBounds
                                positions={polygonPositions}
                            />

                            <Polygon
                                positions={polygonPositions}
                                pathOptions={{
                                    color: "blue"
                                }}
                            />

                            <LocationPicker
                                onSelect={handleSelectPoint}
                            />

                            {point && (
                                <Marker position={point} />
                            )}

                        </MapContainer>

                    ) : (

                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            Không có polygon thửa đất
                        </div>

                    )}

                </div>

                <div
                    style={{
                        marginTop: 12,
                        color: "#666"
                    }}
                >
                    📍 Click vào bản đồ để chọn vị trí công trình
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

                    <Button onClick={onClose}>
                        Hủy
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Lưu công trình
                    </Button>

                </div>

            </Form>
        </Modal>
    );
}