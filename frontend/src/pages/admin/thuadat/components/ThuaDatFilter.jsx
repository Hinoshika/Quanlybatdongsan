import {
    Input,
    Select,
    InputNumber,
    Button
} from "antd";

export default function ThuaDatFilter({
    filters,
    setFilters,
    onSearch,
    onReset
}) {

    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 12
            }}
        >

            <Input
                placeholder="🔎 CCCD chủ sở hữu"
                style={{ width: 250 }}
                allowClear
                value={filters.so_cccd}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        so_cccd: e.target.value
                    })
                }
            />

            <Select
                placeholder="Loại đất"
                style={{ width: 150 }}
                allowClear
                value={filters.loai_dat}
                onChange={(v) =>
                    setFilters({
                        ...filters,
                        loai_dat: v
                    })
                }
                options={[
                    { value: "TP Hà Nội", label: "TPHà Nội" },
                    { value: "TP HCM", label: "TP Hồ Chí Minh" },
                    { value: "TP Đà Nẵng", label: "TP Đà Nẵng" },
                    { value: "TP. Hải Phòng", label: "TP. Hải Phòng" },
                    { value: "TP HCM", label: "TP Hồ Chí Minh" },
                    { value: "TP. Cần Thơ", label: "TP. Cần Thơ" },
                    { value: "TP. Huế", label: "TP. Huế" },
                    { value: "Tuyên Quang", label: "Tuyên Quang" },
                    { value: "Lào Cai", label: "Lào Cai" },
                ]}
            />

            <Select
                placeholder="Trạng thái"
                style={{ width: 160 }}
                allowClear
                value={filters.trang_thai}
                onChange={(v) =>
                    setFilters({
                        ...filters,
                        trang_thai: v
                    })
                }
                options={[
                    { value: "Đang sử dụng", label: "Đang sử dụng" },
                    { value: "Chưa sử dụng", label: "Chưa sử dụng" },
                    { value: "Tranh chấp", label: "Tranh chấp" },
                    { value: "Thu hồi", label: "Thu hồi" }
                ]}
            />

            <InputNumber
                placeholder="Diện tích từ"
                style={{ width: 150 }}
                value={filters.dien_tich_min}
                onChange={(v) =>
                    setFilters({
                        ...filters,
                        dien_tich_min: v
                    })
                }
            />

            <InputNumber
                placeholder="Diện tích đến"
                style={{ width: 150 }}
                value={filters.dien_tich_max}
                onChange={(v) =>
                    setFilters({
                        ...filters,
                        dien_tich_max: v
                    })
                }
            />

            <Button
                type="primary"
                onClick={onSearch}
            >
                🔍 Tìm kiếm
            </Button>

            <Button onClick={onReset}>
                Reset
            </Button>

        </div>
    );
}