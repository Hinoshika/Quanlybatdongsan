import { useState, useMemo } from "react";
import {
    Row,
    Col,
    Card,
    Statistic,
    Input,
    List,
    Drawer,
    Descriptions,
    Tag,
    Button
} from "antd";

import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const mockData = [
    {
        id: 1,
        ma_thua: "TD001",
        loai_dat: "Đất ở đô thị",
        dien_tich: 350,
        trang_thai: "Đang sử dụng",
        chu_so_huu: "Nguyễn Văn A",
        polygon: [
            [21.0286, 105.8541],
            [21.0288, 105.8541],
            [21.0288, 105.8545],
            [21.0286, 105.8545]
        ]
    },
    {
        id: 2,
        ma_thua: "TD002",
        loai_dat: "Đất nông nghiệp",
        dien_tich: 1200,
        trang_thai: "Chờ xử lý",
        chu_so_huu: "Trần Văn B",
        polygon: [
            [21.0291, 105.855],
            [21.0293, 105.855],
            [21.0293, 105.8554],
            [21.0291, 105.8554]
        ]
    }
];

export default function BanDoPage() {
    const [keyword, setKeyword] = useState("");

    const [selectedThua, setSelectedThua] =
        useState(null);

    const filteredData = useMemo(() => {
        return mockData.filter(
            item =>
                item.ma_thua
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    ) ||
                item.chu_so_huu
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    )
        );
    }, [keyword]);

    const getColor = status => {
        switch (status) {
            case "Đang sử dụng":
                return "#52c41a";

            case "Chờ xử lý":
                return "#faad14";

            case "Tranh chấp":
                return "#ff4d4f";

            case "Thu hồi":
                return "#8c8c8c";

            default:
                return "#1677ff";
        }
    };

    return (
        <div>
            {/* KPI */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng thửa đất"
                            value={
                                mockData.length
                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đang sử dụng"
                            value={
                                mockData.filter(
                                    x =>
                                        x.trang_thai ===
                                        "Đang sử dụng"
                                ).length
                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Chờ xử lý"
                            value={
                                mockData.filter(
                                    x =>
                                        x.trang_thai ===
                                        "Chờ xử lý"
                                ).length
                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tranh chấp"
                            value={
                                mockData.filter(
                                    x =>
                                        x.trang_thai ===
                                        "Tranh chấp"
                                ).length
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card
                style={{
                    marginTop: 16,
                    marginBottom: 16
                }}
            >
                <Input.Search
                    placeholder="Tìm mã thửa hoặc chủ sở hữu..."
                    allowClear
                    onChange={e =>
                        setKeyword(
                            e.target.value
                        )
                    }
                />
            </Card>

            {/* Main */}
            <Row gutter={16}>
                {/* Sidebar */}
                <Col span={6}>
                    <Card
                        title="Danh sách thửa đất"
                        style={{
                            height: "75vh",
                            overflow: "auto"
                        }}
                    >
                        <List
                            dataSource={
                                filteredData
                            }
                            renderItem={item => (
                                <List.Item
                                    onClick={() =>
                                        setSelectedThua(
                                            item
                                        )
                                    }
                                    style={{
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    <List.Item.Meta
                                        title={
                                            item.ma_thua
                                        }
                                        description={
                                            <>
                                                <div>
                                                    {
                                                        item.loai_dat
                                                    }
                                                </div>

                                                <div>
                                                    {
                                                        item.dien_tich
                                                    }
                                                    m²
                                                </div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* MAP */}
                <Col span={18}>
                    <Card
                        title="Bản đồ thửa đất"
                        bodyStyle={{
                            padding: 0
                        }}
                    >
                        <MapContainer
                            center={[
                                21.0285,
                                105.8542
                            ]}
                            zoom={17}
                            style={{
                                height:
                                    "75vh",
                                width:
                                    "100%"
                            }}
                        >
                            <TileLayer
                                attribution="OSM"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {filteredData.map(
                                item => (
                                    <Polygon
                                        key={
                                            item.id
                                        }
                                        positions={
                                            item.polygon
                                        }
                                        eventHandlers={{
                                            click: () =>
                                                setSelectedThua(
                                                    item
                                                )
                                        }}
                                        pathOptions={{
                                            color:
                                                selectedThua?.id ===
                                                    item.id
                                                    ? "#ff4d4f"
                                                    : getColor(
                                                        item.trang_thai
                                                    ),
                                            weight:
                                                selectedThua?.id ===
                                                    item.id
                                                    ? 5
                                                    : 2
                                        }}
                                    >
                                        <Popup>
                                            <b>
                                                {
                                                    item.ma_thua
                                                }
                                            </b>

                                            <br />

                                            {
                                                item.loai_dat
                                            }

                                            <br />

                                            {
                                                item.dien_tich
                                            }
                                            m²

                                            <br />

                                            {
                                                item.chu_so_huu
                                            }
                                        </Popup>
                                    </Polygon>
                                )
                            )}
                        </MapContainer>
                    </Card>
                </Col>
            </Row>

            {/* Drawer */}
            <Drawer
                width={500}
                title="Chi tiết thửa đất"
                open={!!selectedThua}
                onClose={() =>
                    setSelectedThua(null)
                }
            >
                {selectedThua && (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                        >
                            <Descriptions.Item label="Mã thửa">
                                {
                                    selectedThua.ma_thua
                                }
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại đất">
                                {
                                    selectedThua.loai_dat
                                }
                            </Descriptions.Item>

                            <Descriptions.Item label="Diện tích">
                                {
                                    selectedThua.dien_tich
                                }
                                m²
                            </Descriptions.Item>

                            <Descriptions.Item label="Chủ sở hữu">
                                {
                                    selectedThua.chu_so_huu
                                }
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag
                                    color="green"
                                >
                                    {
                                        selectedThua.trang_thai
                                    }
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Button
                            type="primary"
                            block
                            style={{
                                marginTop: 16
                            }}
                        >
                            Xem hồ sơ
                        </Button>
                    </>
                )}
            </Drawer>
        </div>
    );
}