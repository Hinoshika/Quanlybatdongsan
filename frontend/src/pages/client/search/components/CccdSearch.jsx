import { Input, Button } from "antd";
import { useState } from "react";

export default function CccdSearch({ onSearch }) {

    const [cccd, setCccd] = useState("");

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <Input
                placeholder="Nhập CCCD"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
            />

            <Button
                type="primary"
                onClick={() => onSearch(cccd)}
            >
                Tìm kiếm
            </Button>
        </div>
    );
}