import { Input, Select, Button } from "antd";
import { useState } from "react";

export default function CongTrinhFilter({
    filters,
    setFilters,
    onSearch,
    onReset
}) {
    const [local, setLocal] = useState(filters);

    const handleChange = (key, value) => {
        const updated = {
            ...local,
            [key]: value
        };

        setLocal(updated);
        setFilters(updated);
    };

    return (
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>

            <Input
                placeholder="CCCD chủ sở hữu"
                style={{ width: 200 }}
                value={local.so_cccd}
                onChange={(e) =>
                    handleChange("so_cccd", e.target.value)
                }
            />

            <Input
                placeholder="Loại công trình"
                style={{ width: 180 }}
                value={local.loai_cong_trinh}
                onChange={(e) =>
                    handleChange("loai_cong_trinh", e.target.value)
                }
            />

            <Select
                placeholder="Trạng thái"
                style={{ width: 180 }}
                value={local.trang_thai}
                onChange={(v) =>
                    handleChange("trang_thai", v)
                }
                allowClear
                options={[
                    {
                        value: "Đang sử dụng",
                        label: "Đang sử dụng"
                    },
                    {
                        value: "Chưa hoàn thành",
                        label: "Chưa hoàn thành"
                    },
                    {
                        value: "thu hồi",
                        label: "Thu hồi"
                    }
                ]}
            />

            <Input
                placeholder="Diện tích min"
                style={{ width: 130 }}
                value={local.dien_tich_min}
                onChange={(e) =>
                    handleChange("dien_tich_min", e.target.value)
                }
            />

            <Input
                placeholder="Diện tích max"
                style={{ width: 130 }}
                value={local.dien_tich_max}
                onChange={(e) =>
                    handleChange("dien_tich_max", e.target.value)
                }
            />

            <Button type="primary" onClick={onSearch}>
                Tìm kiếm
            </Button>

            <Button onClick={onReset}>
                Reset
            </Button>
        </div>
    );
}