import {
    Drawer,
    Form,
    Button,
    message,
    Card,
    Tag,
    Row,
    Col,
    Table,
    Modal
} from "antd";

import {
    useState,
    useMemo
} from "react";

import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    useMapEvents,
    Marker
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
    deleteThuaDat
} from "../../../../services/thuaDat.service";

import AddThuaDatModal from "./AddThuaDatModal";

// ================= MAP CLICK =================

function MapClickHandler({

    data,
    setClickedData,
    setActiveId,
    setMarker

}) {

    useMapEvents({

        click(e) {

            const { lat, lng } = e.latlng;

            setMarker([lat, lng]);

            // 🔥 tìm gần vị trí click

            const nearby = data.filter(item => {

                const coords =
                    item.geom?.coordinates?.[0];

                if (!coords) {
                    return false;
                }

                // ================= CENTER =================

                let latSum = 0;
                let lngSum = 0;

                coords.forEach(c => {

                    lngSum += c[0];
                    latSum += c[1];
                });

                const centerLat =
                    latSum / coords.length;

                const centerLng =
                    lngSum / coords.length;

                // ================= DISTANCE =================

                const distance =
                    Math.sqrt(

                        Math.pow(
                            centerLat - lat,
                            2
                        ) +

                        Math.pow(
                            centerLng - lng,
                            2
                        )
                    );

                item.distance = distance;

                return distance < 0.002;
            });

            nearby.sort(
                (a, b) =>
                    a.distance - b.distance
            );

            setClickedData(nearby);

            if (nearby.length > 0) {

                setActiveId(
                    nearby[0].id
                );

            } else {

                setActiveId(null);
            }
        }
    });

    return null;
}

// ================= PAGE =================

export default function GopThuaDrawer({
    open,
    onClose,
    data = [],
    onSubmit
}) {

    const [form] = Form.useForm();

    // 🔥 nearby data
    const [clickedData, setClickedData] =
        useState([]);

    // 🔥 selected ids
    const [selectedIds, setSelectedIds] =
        useState([]);

    // 🔥 active polygon
    const [activeId, setActiveId] =
        useState(null);

    // 🔥 marker
    const [marker, setMarker] =
        useState(null);

    // 🔥 modal thêm thửa mới
    const [openAddModal, setOpenAddModal] =
        useState(false);

    // ================= SELECTED =================

    const selectedData = useMemo(() => {

        return data.filter(
            i => selectedIds.includes(i.id)
        );

    }, [selectedIds, data]);

    // ================= TOTAL =================

    const totalArea = useMemo(() => {

        return selectedData.reduce(
            (sum, i) =>
                sum + Number(i.dien_tich || 0),
            0
        );

    }, [selectedData]);

    // ================= SELECT ROW =================

    const handleSelectRow = (id) => {

        let newSelected = [];

        if (selectedIds.includes(id)) {

            newSelected =
                selectedIds.filter(
                    i => i !== id
                );

        } else {

            newSelected = [
                ...selectedIds,
                id
            ];
        }

        setSelectedIds(newSelected);
    };

    // ================= GỘP THỬA =================

    const handleSubmit = async () => {

        if (selectedIds.length < 2) {

            message.error(
                "Chọn ít nhất 2 thửa"
            );

            return;
        }

        Modal.confirm({

            title: "Xác nhận gộp thửa",

            content:
                "Sau khi gộp sẽ xoá các thửa cũ và tạo thửa mới.",

            okText: "Gộp thửa",

            cancelText: "Huỷ",

            async onOk() {

                try {

                    // 🔥 xoá các thửa cũ

                    await Promise.all(

                        selectedIds.map(id =>
                            deleteThuaDat(id)
                        )
                    );

                    message.success(
                        "Đã xoá các thửa cũ"
                    );

                    // 🔥 mở modal thêm thửa mới

                    setOpenAddModal(true);

                } catch (err) {

                    console.error(err);

                    message.error(
                        "Gộp thửa thất bại"
                    );
                }
            }
        });
    };

    // ================= ADD NEW =================

    const handleCreateNew = async (values) => {

        try {

            // 🔥 callback tạo thửa mới

            await onSubmit(values);

            message.success(
                "Tạo thửa mới thành công"
            );

            setOpenAddModal(false);

            setClickedData([]);
            setSelectedIds([]);
            setActiveId(null);
            setMarker(null);

            form.resetFields();

            onClose();

        } catch (err) {

            console.error(err);

            message.error(
                "Tạo thửa mới thất bại"
            );
        }
    };

    // ================= UI =================

    return (

        <>
            <Drawer
                title="🔗 Gộp thửa đất"

                placement="right"

                width={1450}

                open={open}

                destroyOnClose

                onClose={() => {

                    setClickedData([]);
                    setSelectedIds([]);
                    setActiveId(null);
                    setMarker(null);

                    form.resetFields();

                    onClose();
                }}
            >

                <Row gutter={16}>

                    {/* ================= MAP ================= */}

                    <Col span={15}>

                        <Card
                            title="🗺️ Click gần vị trí thửa đất"
                            size="small"
                        >

                            <MapContainer
                                center={[
                                    21.0285,
                                    105.8542
                                ]}

                                zoom={15}

                                style={{
                                    height: 820,
                                    width: "100%",
                                    borderRadius: 8
                                }}
                            >

                                {/* TILE */}

                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* CLICK MAP */}

                                <MapClickHandler

                                    data={data}

                                    setClickedData={
                                        setClickedData
                                    }

                                    setActiveId={
                                        setActiveId
                                    }

                                    setMarker={
                                        setMarker
                                    }
                                />

                                {/* MARKER */}

                                {
                                    marker && (

                                        <Marker
                                            position={marker}
                                        />
                                    )
                                }

                                {/* POLYGON */}

                                {
                                    data.map(item => {

                                        const coords =
                                            item.geom?.coordinates?.[0];

                                        if (!coords) {
                                            return null;
                                        }

                                        const positions =
                                            coords.map(c => [
                                                c[1],
                                                c[0]
                                            ]);

                                        const isSelected =
                                            selectedIds.includes(item.id);

                                        const isActive =
                                            activeId === item.id;

                                        return (

                                            <Polygon
                                                key={item.id}

                                                positions={positions}

                                                pathOptions={{

                                                    color:
                                                        isSelected
                                                            ? "#ff4d4f"
                                                            : isActive
                                                                ? "#fa8c16"
                                                                : "#1677ff",

                                                    fillColor:
                                                        isSelected
                                                            ? "#ffccc7"
                                                            : "#69b1ff",

                                                    fillOpacity:
                                                        isSelected
                                                            ? 0.7
                                                            : 0.4,

                                                    weight:
                                                        isActive
                                                            ? 5
                                                            : 2
                                                }}
                                            >

                                                <Popup>

                                                    <div
                                                        style={{
                                                            minWidth: 220
                                                        }}
                                                    >

                                                        <h4>
                                                            🏠 Thửa đất
                                                        </h4>

                                                        <p>
                                                            <b>Thửa:</b>{" "}
                                                            {item.so_thua}
                                                        </p>

                                                        <p>
                                                            <b>Tờ:</b>{" "}
                                                            {item.so_to_ban_do}
                                                        </p>

                                                        <p>
                                                            <b>Diện tích:</b>{" "}
                                                            {item.dien_tich} m²
                                                        </p>

                                                        <p>
                                                            <b>Địa chỉ:</b>{" "}
                                                            {item.dia_chi}
                                                        </p>

                                                    </div>

                                                </Popup>

                                            </Polygon>
                                        );
                                    })
                                }

                            </MapContainer>

                        </Card>

                    </Col>

                    {/* ================= RIGHT ================= */}

                    <Col span={9}>

                        <Card
                            title="📋 Thửa đất gần vị trí click"
                            size="small"
                        >

                            {/* INFO */}

                            <div
                                style={{
                                    marginBottom: 12
                                }}
                            >

                                <Tag color="blue">
                                    Đã chọn:
                                    {" "}
                                    {selectedIds.length}
                                </Tag>

                                <Tag color="green">
                                    Tổng DT:
                                    {" "}
                                    {totalArea} m²
                                </Tag>

                            </div>

                            {/* TABLE */}

                            <Table
                                size="small"

                                rowKey="id"

                                pagination={false}

                                scroll={{
                                    y: 620
                                }}

                                dataSource={clickedData}

                                rowSelection={{

                                    selectedRowKeys:
                                        selectedIds,

                                    onChange: keys => {
                                        setSelectedIds(keys);
                                    }
                                }}

                                onRow={(record) => ({

                                    onClick: () => {

                                        handleSelectRow(
                                            record.id
                                        );
                                    }
                                })}

                                columns={[

                                    {
                                        title: "Thửa",
                                        dataIndex: "so_thua",
                                        width: 80
                                    },

                                    {
                                        title: "Tờ",
                                        dataIndex: "so_to_ban_do",
                                        width: 80
                                    },

                                    {
                                        title: "Diện tích",
                                        dataIndex: "dien_tich",

                                        render: v =>
                                            `${v} m²`
                                    },
                                ]}
                            />

                            {/* BUTTON */}

                            <Button
                                type="primary"

                                danger

                                block

                                style={{
                                    marginTop: 16
                                }}

                                onClick={handleSubmit}
                            >
                                🔗 Gộp thửa
                            </Button>

                        </Card>

                    </Col>

                </Row>

            </Drawer>

            {/* ================= MODAL THỬA MỚI ================= */}

            <AddThuaDatModal
                open={openAddModal}

                onClose={() =>
                    setOpenAddModal(false)
                }

                onSubmit={handleCreateNew}
            />
        </>
    );
}