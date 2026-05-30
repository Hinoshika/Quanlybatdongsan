import { useState, useRef } from "react";

import {
    Card,
    Input,
    Button,
    Table,
    Modal,
    Descriptions,
    Tabs,
    Row,
    Col,
    Empty,
    Typography,
    Radio,
    Divider,
    Tag,
    message
} from "antd";

import {
    SearchOutlined,
    EnvironmentOutlined,
    UserOutlined,
    HomeOutlined
} from "@ant-design/icons";

import {
    MapContainer,
    TileLayer,
    GeoJSON
} from "react-leaflet";

// ================= THỬA ĐẤT =================
import {
    searchByCCCD as searchLandByCCCD,
    searchByMap as searchLandByMap
} from "../../../services/thuaDat.service";

// ================= CÔNG TRÌNH =================
import {
    searchCongTrinhByCCCD,
    searchCongTrinhByMap
} from "../../../services/congTrinh.service";

const { TabPane } = Tabs;
const { Title } = Typography;

export default function SearchPage() {

    const [activeMainTab, setActiveMainTab] = useState("thuadat");

    const [searchMode, setSearchMode] = useState("cccd");

    const [cccd, setCccd] = useState("");

    const [loading, setLoading] = useState(false);

    // ================= DATA =================
    const [tableData, setTableData] = useState([]);
    const [geoData, setGeoData] = useState([]);

    const [constructionData, setConstructionData] = useState([]);
    const [constructionGeoData, setConstructionGeoData] = useState([]);

    // ================= MODAL =================
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const mapRef = useRef(null);

    // =====================================================
    // THỬA ĐẤT
    // =====================================================

    const searchLandCCCD = async () => {

        if (!cccd.trim()) {
            message.warning("Nhập CCCD");
            return;
        }

        setLoading(true);

        try {

            const list = await searchLandByCCCD(
                cccd
            );

            setTableData(list);

            setGeoData(
                list.filter(i => i.geom)
            );

        } catch (err) {

            console.error(err);

            message.error(
                err.message || "Lỗi tìm kiếm"
            );

        } finally {

            setLoading(false);
        }
    };

    const searchLandMap = async (
        lat,
        lng
    ) => {

        setLoading(true);

        try {

            const list = await searchLandByMap(
                lat,
                lng
            );

            setTableData(list);

            setGeoData(
                list.filter(i => i.geom)
            );

        } catch (err) {

            console.error(err);

            message.error(
                err.message || "Lỗi tìm kiếm"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CÔNG TRÌNH
    // =====================================================

    const handleSearchCongTrinhCCCD = async () => {

        if (!cccd.trim()) {
            message.warning("Nhập CCCD");
            return;
        }

        setLoading(true);

        try {

            const list = await searchCongTrinhByCCCD(
                cccd
            );

            setConstructionData(list);

            setConstructionGeoData(
                list.filter(i => i.geom)
            );

        } catch (err) {

            console.error(err);

            message.error(
                err.message || "Lỗi tìm kiếm"
            );

        } finally {

            setLoading(false);
        }
    };

    const handleSearchCongTrinhMap = async (
        lat,
        lng
    ) => {

        setLoading(true);

        try {

            const list = await searchCongTrinhByMap(
                lat,
                lng
            );

            setConstructionData(list);

            setConstructionGeoData(
                list.filter(i => i.geom)
            );

        } catch (err) {

            console.error(err);

            message.error(
                err.message || "Lỗi tìm kiếm"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CLICK ROW
    // =====================================================

    const handleClick = (
        record,
        isConstruction = false
    ) => {

        setSelected({
            ...record,
            isConstruction
        });

        setOpen(true);

        if (
            record.lat &&
            record.lng &&
            mapRef.current
        ) {

            mapRef.current.setView(
                [record.lat, record.lng],
                17
            );
        }
    };

    // =====================================================
    // CURRENT DATA
    // =====================================================

    const currentTableData =
        activeMainTab === "thuadat"
            ? tableData
            : constructionData;

    const currentGeoData =
        activeMainTab === "thuadat"
            ? geoData
            : constructionGeoData;

    // =====================================================
    // HANDLE SEARCH
    // =====================================================

    const handleSearch = () => {

        if (activeMainTab === "thuadat") {

            searchLandCCCD();

        } else {

            handleSearchCongTrinhCCCD();
        }
    };

    return (

        <div
            style={{
                padding: "20px 24px",
                background: "#f5f5f5",
                minHeight: "100vh"
            }}
        >

            <Title level={3}>
                Tra cứu Thửa Đất và Công Trình
            </Title>

            {/* MAIN TAB */}
            <Card style={{ marginBottom: 20 }}>

                <Tabs
                    activeKey={activeMainTab}
                    onChange={setActiveMainTab}
                    type="card"
                >

                    <TabPane
                        key="thuadat"
                        tab={
                            <span>
                                <HomeOutlined />
                                Thửa Đất
                            </span>
                        }
                    />

                    <TabPane
                        key="congtrinh"
                        tab={
                            <span>
                                <EnvironmentOutlined />
                                Công Trình
                            </span>
                        }
                    />

                </Tabs>

            </Card>

            {/* SEARCH MODE */}
            <Card style={{ marginBottom: 20 }}>

                <Radio.Group
                    value={searchMode}
                    onChange={(e) =>
                        setSearchMode(
                            e.target.value
                        )
                    }
                >

                    <Radio.Button value="cccd">
                        Tìm theo CCCD
                    </Radio.Button>

                    <Radio.Button value="map">
                        Tìm trên bản đồ
                    </Radio.Button>

                </Radio.Group>

            </Card>

            {/* SEARCH CCCD */}
            {searchMode === "cccd" && (

                <Card>

                    <Row gutter={12}>

                        <Col flex="auto">

                            <Input
                                size="large"
                                value={cccd}
                                onChange={(e) =>
                                    setCccd(
                                        e.target.value
                                    )
                                }
                                onPressEnter={
                                    handleSearch
                                }
                                placeholder="Nhập CCCD"
                                prefix={
                                    <UserOutlined />
                                }
                            />

                        </Col>

                        <Col>

                            <Button
                                type="primary"
                                size="large"
                                icon={
                                    <SearchOutlined />
                                }
                                onClick={
                                    handleSearch
                                }
                                loading={loading}
                            >
                                Tìm kiếm
                            </Button>

                        </Col>

                    </Row>

                </Card>
            )}

            {/* MAP */}
            {searchMode === "map" && (

                <Card
                    style={{ marginTop: 20 }}
                    bodyStyle={{
                        padding: 0
                    }}
                >

                    <MapContainer
                        center={[
                            21.0285,
                            105.8542
                        ]}
                        zoom={13}
                        style={{
                            height: 520
                        }}
                        whenCreated={(map) =>
                        (
                            mapRef.current = map
                        )
                        }
                        onClick={(e) => {

                            if (
                                activeMainTab ===
                                "thuadat"
                            ) {

                                searchLandMap(
                                    e.latlng.lat,
                                    e.latlng.lng
                                );

                            } else {

                                handleSearchCongTrinhMap(
                                    e.latlng.lat,
                                    e.latlng.lng
                                );
                            }
                        }}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {currentGeoData.map(
                            (item) => (

                                item.geom && (

                                    <GeoJSON
                                        key={item.id}
                                        data={
                                            item.geom
                                        }
                                        style={{
                                            color:
                                                activeMainTab ===
                                                    "thuadat"
                                                    ? "#1890ff"
                                                    : "#ff4d4f",

                                            weight: 3,
                                            fillOpacity: 0.2
                                        }}
                                        onEachFeature={(
                                            feature,
                                            layer
                                        ) => {

                                            layer.on(
                                                "click",
                                                () => {

                                                    handleClick(
                                                        item,
                                                        activeMainTab ===
                                                        "congtrinh"
                                                    );
                                                }
                                            );
                                        }}
                                    />
                                )
                            )
                        )}

                    </MapContainer>

                </Card>
            )}

        </div>
    );
}