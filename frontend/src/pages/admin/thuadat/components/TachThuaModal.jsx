import {
    useState,
    useEffect
} from "react";

import {
    Drawer,
    Card,
    Row,
    Col,
    Table,
    Button,
    Tag,
    Form,
    InputNumber,
    message
} from "antd";

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
    searchByMap,
    deleteThuaDat
} from "../../../../services/thuaDat.service";

import AddThuaDatModal
    from "./AddThuaDatModal";

// ================= CLICK MAP =================

function MapClickHandler({

    setClickedData,
    setMarker,
    setLoading

}) {

    useMapEvents({

        async click(e) {

            const { lat, lng } =
                e.latlng;

            setMarker([
                lat,
                lng
            ]);

            setLoading(true);

            try {

                const result =
                    await searchByMap(
                        lat,
                        lng,
                        50
                    );

                const nearby =
                    Array.isArray(result)
                        ? result
                        : result?.data || [];

                setClickedData(
                    nearby
                );

            } catch (err) {

                console.error(err);

                message.error(
                    "Không tìm thấy thửa đất"
                );

            } finally {

                setLoading(false);
            }
        }
    });

    return null;
}

// ================= COMPONENT =================

export default function TachThuaDrawer({

    open,
    onClose,
    data = [],
    onSubmit

}) {

    const [form] = Form.useForm();

    // ================= STATE =================

    const [marker, setMarker] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [clickedData, setClickedData] =
        useState([]);

    const [selectedItem, setSelectedItem] =
        useState(null);

    // ================= ADD MODAL =================

    const [openAdd, setOpenAdd] =
        useState(false);

    const [addQueue, setAddQueue] =
        useState([]);

    const [currentAdd, setCurrentAdd] =
        useState(null);

    // ================= CHỌN THỬA =================

    const handleSelect = (item) => {

        setSelectedItem(item);

        form.setFieldsValue({

            so_thua_con: 2
        });
    };

    // ================= MỞ ADD MODAL =================

    const handleOpenAddModal = (data) => {

        setAddQueue(prev => [
            ...prev,
            data
        ]);
    };

    // ================= EFFECT =================

    useEffect(() => {

        if (
            addQueue.length > 0 &&
            !currentAdd
        ) {

            setCurrentAdd(
                addQueue[0]
            );

            setOpenAdd(true);
        }

    }, [
        addQueue,
        currentAdd
    ]);

    // ================= ĐÓNG MODAL =================

    const handleCloseAddModal = () => {

        const newQueue =
            addQueue.slice(1);

        setAddQueue(newQueue);

        if (newQueue.length > 0) {

            setCurrentAdd(
                newQueue[0]
            );

            setOpenAdd(true);

        } else {

            setCurrentAdd(null);

            setOpenAdd(false);
        }
    };

    // ================= SUBMIT =================

    const handleSubmit = async (values) => {

        if (!selectedItem) {

            message.error(
                "Chọn thửa đất"
            );

            return;
        }

        try {

            setLoading(true);

            // ================= DELETE =================

            await deleteThuaDat(
                selectedItem.id
            );

            // ================= CREATE MODAL =================

            const total =
                Number(
                    values.so_thua_con
                );

            const area =
                Number(
                    selectedItem.dien_tich || 0
                ) / total;

            for (
                let i = 0;
                i < total;
                i++
            ) {

                handleOpenAddModal({

                    parent:
                        selectedItem,

                    index:
                        i + 1,

                    tong_so_thua:
                        total,

                    dien_tich:
                        area,

                    polygon:
                        selectedItem.geom
                });
            }

            // ================= CALLBACK =================

            if (onSubmit) {

                onSubmit({

                    thua_dat_id:
                        selectedItem.id,

                    so_thua_con:
                        total
                });
            }

            message.success(
                `Tách ${total} thửa`
            );

            // ================= RESET =================

            setSelectedItem(null);

            setClickedData([]);

            setMarker(null);

            form.resetFields();

            onClose();

        } catch (err) {

            console.error(err);

            message.error(
                "Tách thửa thất bại"
            );

        } finally {

            setLoading(false);
        }
    };

    // ================= UI =================

    return (

        <>

            {/* ================= DRAWER ================= */}

            <Drawer

                title="✂️ Tách thửa đất"

                placement="right"

                width={1450}

                open={open}

                destroyOnClose

                onClose={() => {

                    setSelectedItem(null);

                    setClickedData([]);

                    setMarker(null);

                    form.resetFields();

                    onClose();
                }}
            >

                <Row gutter={16}>

                    {/* ================= MAP ================= */}

                    <Col span={15}>

                        <Card
                            title="🗺️ Click gần thửa đất để tìm"
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

                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* CLICK */}

                                <MapClickHandler

                                    setClickedData={
                                        setClickedData
                                    }

                                    setMarker={
                                        setMarker
                                    }

                                    setLoading={
                                        setLoading
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

                                        const geom =
                                            typeof item.geom === "string"
                                                ? JSON.parse(item.geom)
                                                : item.geom;

                                        const coords =
                                            geom?.coordinates?.[0];

                                        if (!coords) {
                                            return null;
                                        }

                                        const positions =
                                            coords.map(c => [
                                                c[1],
                                                c[0]
                                            ]);

                                        const isSelected =
                                            selectedItem?.id === item.id;

                                        return (

                                            <Polygon

                                                key={item.id}

                                                positions={positions}

                                                pathOptions={{

                                                    color:
                                                        isSelected
                                                            ? "#ff4d4f"
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
                                                        isSelected
                                                            ? 5
                                                            : 2
                                                }}

                                                eventHandlers={{

                                                    click: () =>
                                                        handleSelect(item)
                                                }}
                                            >

                                                <Popup>

                                                    <div>

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
                            title="📋 Chọn thửa để tách"
                            size="small"
                        >

                            {/* TABLE */}

                            <Table

                                size="small"

                                rowKey="id"

                                loading={loading}

                                pagination={false}

                                scroll={{
                                    y: 300
                                }}

                                dataSource={
                                    clickedData
                                }

                                rowClassName={(record) =>
                                    selectedItem?.id === record.id
                                        ? "selected-row"
                                        : ""
                                }

                                onRow={(record) => ({

                                    onClick: () =>
                                        handleSelect(record)
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

                            {/* INFO */}

                            {
                                selectedItem && (

                                    <div
                                        style={{
                                            marginTop: 20
                                        }}
                                    >

                                        <Tag color="blue">
                                            Thửa:
                                            {" "}
                                            {selectedItem.so_thua}
                                        </Tag>

                                        <Tag color="green">
                                            {selectedItem.dien_tich} m²
                                        </Tag>

                                    </div>
                                )
                            }

                            {/* FORM */}

                            <Form

                                form={form}

                                layout="vertical"

                                onFinish={handleSubmit}

                                style={{
                                    marginTop: 20
                                }}
                            >

                                <Form.Item

                                    label="Số thửa con"

                                    name="so_thua_con"

                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >

                                    <InputNumber

                                        min={2}

                                        style={{
                                            width: "100%"
                                        }}
                                    />

                                </Form.Item>

                                <Button

                                    type="primary"

                                    htmlType="submit"

                                    loading={loading}

                                    block
                                >
                                    ✂️ Tách thửa
                                </Button>

                            </Form>

                        </Card>

                    </Col>

                </Row>

                {/* CSS */}

                <style>
                    {`
                        .selected-row td {
                            background: #e6f4ff !important;
                        }
                    `}
                </style>

            </Drawer>

            {/* ================= ADD MODAL ================= */}

            {
                currentAdd && (

                    <AddThuaDatModal

                        open={openAdd}

                        onClose={
                            handleCloseAddModal
                        }

                        defaultValues={{

                            so_thua:
                                `${currentAdd.parent.so_thua}-${currentAdd.index}`,

                            so_to_ban_do:
                                currentAdd.parent.so_to_ban_do,

                            dia_chi:
                                currentAdd.parent.dia_chi,

                            tinh:
                                currentAdd.parent.tinh,

                            dien_tich:
                                currentAdd.dien_tich,

                            loai_dat:
                                currentAdd.parent.loai_dat,

                            trang_thai:
                                "dang_su_dung",

                            polygon:
                                currentAdd.polygon
                        }}
                    />
                )
            }

        </>
    );
}