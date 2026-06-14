import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import ChatAI from "./Ai/ChatAI";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function Home() {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header / Hero */}
            <div style={{
                background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                color: "white",
                padding: "60px 20px",
                textAlign: "center"
            }}>
                <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "16px" }}>
                    Hệ Thống Quản Lý Nhà Đất
                </h1>
                <p style={{ fontSize: "20px", maxWidth: "700px", margin: "0 auto 30px" }}>
                    Quản lý thông tin bất động sản • Theo dõi biến động • Hiển thị trực quan trên bản đồ
                </p>
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "start" }}>

                    {/* Phần giới thiệu */}
                    <div>
                        <h2 style={{ fontSize: "32px", marginBottom: "20px", color: "#1e3a8a" }}>
                            Giới thiệu hệ thống
                        </h2>
                        <p style={{ fontSize: "18px", lineHeight: "1.7", color: "#374151", marginBottom: "30px" }}>
                            Hệ thống hỗ trợ quản lý toàn diện nhà đất, công trình và tài sản bất động sản
                            với giao diện trực quan và dễ sử dụng.
                        </p>

                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {[
                                { icon: "📍", text: "Hiển thị vị trí tài sản trên bản đồ" },
                                { icon: "🏠", text: "Quản lý nhà ở, thửa đất, công trình" },
                                { icon: "👤", text: "Theo dõi chủ sở hữu và lịch sử biến động" },
                                { icon: "📊", text: "Tra cứu nhanh và thống kê dữ liệu" }
                            ].map((item, index) => (
                                <li key={index} style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "15px",
                                    marginBottom: "20px",
                                    fontSize: "17px"
                                }}>
                                    <span style={{ fontSize: "28px" }}>{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <ChatAI />
            {/* Tính năng nổi bật */}
            <div style={{ backgroundColor: "white", padding: "60px 20px" }}>
                <h3 style={{ textAlign: "center", fontSize: "28px", marginBottom: "40px", color: "#1e3a8a" }}>
                    Các tính năng chính
                </h3>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "25px"
                }}>
                    <div style={{ padding: "25px", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                        <div style={{ fontSize: "42px", marginBottom: "15px" }}>🗺️</div>
                        <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>Bản đồ tương tác</h4>
                        <p style={{ color: "#64748b" }}>Quản lý và xem vị trí tất cả tài sản trên bản đồ thời gian thực.</p>
                    </div>

                    <div style={{ padding: "25px", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                        <div style={{ fontSize: "42px", marginBottom: "15px" }}>📋</div>
                        <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>Quản lý dữ liệu</h4>
                        <p style={{ color: "#64748b" }}>Lưu trữ thông tin chi tiết thửa đất, giấy tờ pháp lý, hình ảnh.</p>
                    </div>

                    <div style={{ padding: "25px", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                        <div style={{ fontSize: "42px", marginBottom: "15px" }}>📈</div>
                        <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>Thống kê & Báo cáo</h4>
                        <p style={{ color: "#64748b" }}>Tạo báo cáo, biểu đồ và phân tích dữ liệu bất động sản.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}