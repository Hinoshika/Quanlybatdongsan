import { useState, useRef, useEffect } from "react";
import { Tabs, Card, Typography, message } from "antd";
import { HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";

import SearchForm from "./SearchForm";
import MapView from "./MapView";
import ResultsTable from "./ResultsTable";
import DetailModal from "./DetailModal";

import {
    searchByCCCD,
    searchByMap,
    searchByAddress
} from "../../../services/thuaDat.service";

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
    const [address, setAddress] = useState("");

    // Data
    const [tableData, setTableData] = useState([]);
    const [geoData, setGeoData] = useState([]);
    const [constructionData, setConstructionData] = useState([]);
    const [constructionGeoData, setConstructionGeoData] = useState([]);

    // Modal
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const mapRef = useRef(null);

    // Reset data khi đổi tab
    useEffect(() => {
        setTableData([]);
        setGeoData([]);
        setConstructionData([]);
        setConstructionGeoData([]);
        setCccd("");
        setAddress("");
    }, [activeMainTab, searchMode]);

    // ====================== THỬA ĐẤT ======================
    const searchLandCCCD = async () => {
        if (!cccd.trim()) {
            message.warning("Nhập CCCD");
            return;
        }

        setLoading(true);
        try {
            const list = await searchByCCCD(cccd);        // ← Giữ nguyên tên import
            setTableData(Array.isArray(list) ? list : []);
            setGeoData(Array.isArray(list) ? list.filter(i => i.geom) : []);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi tìm kiếm");
            setTableData([]);
            setGeoData([]);
        } finally {
            setLoading(false);
        }
    };

    const searchLandMap = async (lat, lng) => {
        setLoading(true);
        try {
            const list = await searchByMap(lat, lng);     // ← Giữ nguyên tên import
            setTableData(Array.isArray(list) ? list : []);
            setGeoData(Array.isArray(list) ? list.filter(i => i.geom) : []);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi tìm kiếm");
            setTableData([]);
            setGeoData([]);
        } finally {
            setLoading(false);
        }
    };

    const searchLandAddress = async () => {
        if (!address.trim()) {
            message.warning("Nhập địa chỉ");
            return;
        }

        setLoading(true);

        try {
            const list = await searchByAddress(address);

            setTableData(Array.isArray(list) ? list : []);
            setGeoData(Array.isArray(list) ? list.filter(i => i.geom) : []);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi tìm kiếm");
            setTableData([]);
            setGeoData([]);
        } finally {
            setLoading(false);
        }
    };

    // ====================== CÔNG TRÌNH ======================
    const handleSearchCongTrinhCCCD = async () => {
        if (!cccd.trim()) {
            message.warning("Nhập CCCD");
            return;
        }

        setLoading(true);
        try {
            const list = await searchCongTrinhByCCCD(cccd);
            setConstructionData(Array.isArray(list) ? list : []);
            setConstructionGeoData(Array.isArray(list) ? list.filter(i => i.geom) : []);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi tìm kiếm");
            setConstructionData([]);
            setConstructionGeoData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchCongTrinhMap = async (lat, lng) => {
        setLoading(true);
        try {
            const list = await searchCongTrinhByMap(lat, lng);
            setConstructionData(Array.isArray(list) ? list : []);
            setConstructionGeoData(Array.isArray(list) ? list.filter(i => i.geom) : []);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi tìm kiếm");
            setConstructionData([]);
            setConstructionGeoData([]);
        } finally {
            setLoading(false);
        }
    };

    // ====================== HANDLE CLICK ======================
    const handleClick = (record, isConstruction = false) => {

        console.log("CLICK DATA:", record);


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

            setTimeout(() => {

                try {

                    mapRef.current.setView(
                        [
                            Number(record.lat),
                            Number(record.lng)
                        ],
                        17,
                        {
                            animate: true
                        }
                    );

                } catch (err) {

                    console.error(
                        "MAP ERROR:",
                        err
                    );

                }

            }, 300);

        }
    };

    const currentTableData = activeMainTab === "thuadat" ? tableData : constructionData;
    const currentGeoData = activeMainTab === "thuadat" ? geoData : constructionGeoData;

    const handleSearch = () => {
        if (searchMode === "cccd") {
            if (activeMainTab === "thuadat") {
                searchLandCCCD();
            } else {
                handleSearchCongTrinhCCCD();
            }
        }

        if (searchMode === "address") {
            searchLandAddress();
        }
    };

    return (
        <div style={{ padding: "20px 24px", background: "#f5f5f5", minHeight: "100vh" }}>
            <Title level={3}>Tra cứu Thửa Đất và Công Trình</Title>

            <Card style={{ marginBottom: 20 }}>
                <Tabs
                    activeKey={activeMainTab}
                    onChange={setActiveMainTab}
                    type="card"
                >
                    <TabPane key="thuadat" tab={<span><HomeOutlined /> Thửa Đất</span>} />
                    <TabPane key="congtrinh" tab={<span><EnvironmentOutlined /> Công Trình</span>} />
                </Tabs>
            </Card>

            <SearchForm
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                cccd={cccd}
                setCccd={setCccd}
                address={address}
                setAddress={setAddress}
                handleSearch={handleSearch}
                loading={loading}
            />

            <MapView
                searchMode={searchMode}
                activeMainTab={activeMainTab}
                currentGeoData={currentGeoData}
                searchLandMap={searchLandMap}
                handleSearchCongTrinhMap={handleSearchCongTrinhMap}
                handleClick={handleClick}
                mapRef={mapRef}
            />

            <ResultsTable
                currentTableData={currentTableData}
                loading={loading}
                activeMainTab={activeMainTab}
                handleClick={handleClick}
            />

            <DetailModal
                open={open}
                selected={selected}
                setOpen={setOpen}
            />
        </div>
    );
}