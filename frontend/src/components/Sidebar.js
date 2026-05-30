import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar() {
    const [lands, setLands] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/thua-dat")
            .then(res => setLands(res.data));
    }, []);

    return (
        <div style={{
            width: "300px",
            height: "100vh",
            overflow: "auto",
            background: "#f4f4f4",
            padding: "10px"
        }}>
            <h3>📍 Thửa đất</h3>

            {lands.map(item => (
                <div key={item.id} style={{
                    padding: "10px",
                    marginBottom: "8px",
                    background: "white",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}>
                    <b>Thửa {item.so_thua}</b>
                    <div>Diện tích: {item.dien_tich}</div>
                    <div>Loại: {item.loai_dat}</div>
                </div>
            ))}
        </div>
    );
}