import { Card, Row, Col, Spin, Typography, Progress, Button, Tooltip, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    ReloadOutlined,
    HomeOutlined,
    BuildOutlined,
    UserOutlined,
    RiseOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API_THUA_DAT = "http://localhost:5000/api/thua-dat";
const API_CONG_TRINH = "http://localhost:5000/api/cong-trinh";
const API_CHU_SO_HUU = "http://localhost:5000/api/chu-so-huu";
const API_BIEN_DONG = "http://localhost:5000/api/bien-dong";
const API_YEU_CAU = "http://localhost:5000/api/yeu-cau";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        thuaDat: 0,
        congTrinh: 0,
        chuSoHuu: 0,
        bienDong: 0,
    });
    const [animated, setAnimated] = useState(stats);
    const [yeuCauStats, setYeuCauStats] = useState({
        tong: 0,
        choXuLy: 0,
        daDuyet: 0,
        tuChoi: 0,
    });
    useEffect(() => {

        fetchData(true);

        const interval = setInterval(() => {
            fetchData(false);
        }, 60000);


        return () => clearInterval(interval);

    }, []);

    const fetchData = async () => {
        setLoading(true);

        try {
            const [td, ct, csh, bd, yc] =
                await Promise.all([
                    axios.get(API_THUA_DAT),
                    axios.get(API_CONG_TRINH),
                    axios.get(API_CHU_SO_HUU),
                    axios.get(API_BIEN_DONG),
                    axios.get(API_YEU_CAU),
                ]);

            const data = {
                thuaDat: td.data.length,
                congTrinh: ct.data.length,
                chuSoHuu: csh.data.length,
                bienDong: bd.data.length,
            };

            setStats(data);
            animateNumbers(data);

            // ===== THỐNG KÊ YÊU CẦU =====
            const yeuCau = yc.data || [];

            setYeuCauStats({
                tong: yeuCau.length,
                choXuLy: yeuCau.filter(
                    x => x.trang_thai === "CHO_XU_LY"
                ).length,
                daDuyet: yeuCau.filter(
                    x => x.trang_thai === "DA_DUYET"
                ).length,
                tuChoi: yeuCau.filter(
                    x => x.trang_thai === "TU_CHOI"
                ).length,
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const animateNumbers = (target) => {
        const start = performance.now();
        const duration = 500;

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 1);

            setAnimated({
                thuaDat: Math.round(target.thuaDat * ease),
                congTrinh: Math.round(target.congTrinh * ease),
                chuSoHuu: Math.round(target.chuSoHuu * ease),
                bienDong: Math.round(target.bienDong * ease),
            });

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    };

    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

    const cards = [
        {
            label: "Thửa đất",
            value: animated.thuaDat,
            percent: ((animated.thuaDat / total) * 100).toFixed(1),
            color: "#1677ff",
            icon: <HomeOutlined />,
            bgGradient: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
        },
        {
            label: "Công trình",
            value: animated.congTrinh,
            percent: ((animated.congTrinh / total) * 100).toFixed(1),
            color: "#52c41a",
            icon: <BuildOutlined />,
            bgGradient: "linear-gradient(135deg, #52c41a 0%, #95de64 100%)",
        },
        {
            label: "Chủ sở hữu",
            value: animated.chuSoHuu,
            percent: ((animated.chuSoHuu / total) * 100).toFixed(1),
            color: "#faad14",
            icon: <UserOutlined />,
            bgGradient: "linear-gradient(135deg, #faad14 0%, #ffd666 100%)",
        },
        {
            label: "Biến động",
            value: animated.bienDong,
            percent: ((animated.bienDong / total) * 100).toFixed(1),
            color: "#f5222d",
            icon: <RiseOutlined />,
            bgGradient: "linear-gradient(135deg, #f5222d 0%, #ff7875 100%)",
        },
    ];

    return (
        <div style={{ padding: "24px 32px", background: "#f4f6f9", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32
            }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                        📊 Dashboard Quản Lý Bất Động Sản
                    </Title>
                    {/* <Text type="secondary">Cập nhật thời gian thực • Hôm nay: {new Date().toLocaleDateString('vi-VN')}</Text> */}
                </div>

                {/* <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={fetchData}
                    loading={loading}
                    size="large"
                >
                    Làm mới dữ liệu
                </Button> */}
            </div>

            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "120px auto" }} />
            ) : (
                <>
                    {/* Stats Cards */}
                    <Row gutter={[24, 24]}>
                        {cards.map((item, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Tooltip title={`${item.label}: ${item.value} (${item.percent}%)`}>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: 20,
                                            overflow: "hidden",
                                            border: "none",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            transition: "all 0.3s ease",
                                        }}
                                        bodyStyle={{ padding: 0 }}
                                    >
                                        <div style={{
                                            height: 8,
                                            background: item.bgGradient,
                                        }} />

                                        <div style={{ padding: "32px 24px", textAlign: "center" }}>
                                            <div style={{
                                                fontSize: 48,
                                                color: item.color,
                                                marginBottom: 16,
                                                opacity: 0.9
                                            }}>
                                                {item.icon}
                                            </div>

                                            <Progress
                                                type="dashboard"
                                                percent={Number(item.percent)}
                                                strokeColor={item.color}
                                                strokeWidth={12}
                                                size={160}
                                                format={() => (
                                                    <div>
                                                        <div style={{
                                                            fontSize: 32,
                                                            fontWeight: 700,
                                                            color: "#1f2937",
                                                        }}>
                                                            {item.value.toLocaleString('vi-VN')}
                                                        </div>
                                                        <div style={{
                                                            fontSize: 14,
                                                            color: "#64748b",
                                                            marginTop: 4
                                                        }}>
                                                            {item.label}
                                                        </div>
                                                    </div>
                                                )}
                                            />

                                            <div style={{
                                                marginTop: 16,
                                                fontSize: 15,
                                                fontWeight: 600,
                                                color: item.color
                                            }}>
                                                {item.percent}%
                                            </div>
                                        </div>
                                    </Card>
                                </Tooltip>
                            </Col>
                        ))}
                    </Row>

                    <Card
                        style={{
                            marginTop: 32,
                            borderRadius: 16,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
                        }}
                    >
                        <Title level={4}>
                            📨 Thống kê yêu cầu
                        </Title>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={6}>
                                <Card>
                                    <div
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: "#1677ff"
                                        }}
                                    >
                                        {yeuCauStats.tong}
                                    </div>
                                    <Text>Tổng yêu cầu</Text>
                                </Card>
                            </Col>

                            <Col xs={24} md={6}>
                                <Card>
                                    <div
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: "#faad14"
                                        }}
                                    >
                                        {yeuCauStats.choXuLy}
                                    </div>
                                    <Text>Chờ xử lý</Text>
                                </Card>
                            </Col>

                            <Col xs={24} md={6}>
                                <Card>
                                    <div
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: "#52c41a"
                                        }}
                                    >
                                        {yeuCauStats.daDuyet}
                                    </div>
                                    <Text>Đã duyệt</Text>
                                </Card>
                            </Col>

                            <Col xs={24} md={6}>
                                <Card>
                                    <div
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: "#f5222d"
                                        }}
                                    >
                                        {yeuCauStats.tuChoi}
                                    </div>
                                    <Text>Từ chối</Text>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        style={{
                            marginTop: 24,
                            borderRadius: 16
                        }}
                    >
                        <Title level={5}>
                            Tỷ lệ xử lý yêu cầu
                        </Title>

                        <Progress
                            percent={
                                yeuCauStats.tong > 0
                                    ? Math.round(
                                        ((yeuCauStats.daDuyet +
                                            yeuCauStats.tuChoi) *
                                            100) /
                                        yeuCauStats.tong
                                    )
                                    : 0
                            }
                            status="active"
                        />

                        <div style={{ marginTop: 10 }}>
                            Đã xử lý:
                            {" "}
                            {yeuCauStats.daDuyet +
                                yeuCauStats.tuChoi}
                            /
                            {" "}
                            {yeuCauStats.tong}
                        </div>
                    </Card>
                    {/* Insights Section */}
                    <Card
                        style={{
                            marginTop: 40,
                            borderRadius: 16,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 20 }}>
                            📈 Insights & Phân tích
                        </Title>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Text strong>📍 Tỷ lệ đất có công trình:</Text>
                                <div style={{ fontSize: 28, fontWeight: 700, color: "#52c41a", margin: "8px 0" }}>
                                    {stats.congTrinh > 0 ? ((stats.congTrinh / stats.thuaDat) * 100).toFixed(1) : 0}%
                                </div>
                            </Col>
                            <Col span={12}>
                                <Text strong>👥 Trung bình chủ sở hữu / thửa đất:</Text>
                                <div style={{ fontSize: 28, fontWeight: 700, color: "#faad14", margin: "8px 0" }}>
                                    {(stats.chuSoHuu / stats.thuaDat || 0).toFixed(2)}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </>
            )}
        </div>
    );
}