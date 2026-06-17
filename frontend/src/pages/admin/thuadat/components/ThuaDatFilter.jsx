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
                marginTop: 12,
                alignItems: "center",
                overflowX: "auto",
                whiteSpace: "nowrap"
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
                style={{ width: 300 }}
                allowClear
                value={filters.loai_dat}
                onChange={(v) =>
                    setFilters({
                        ...filters,
                        loai_dat: v
                    })
                }
                options={[
                    { value: "Đất ở", label: "Đất ở" },
                    { value: "Đất nông nghiệp", label: "Đất nông nghiệp" },
                    { value: "Đất thương mại", label: "Đất thương mại" },
                    { value: "Đất xây dựng trụ sở cơ quan", label: "Đất xây dựng trụ sở cơ quan." },
                    { value: "Đất quốc phòng, an ninh", label: "Đất quốc phòng, an ninh." },
                    { value: "Đất xây dựng công trình sự nghiệp", label: "Đất xây dựng công trình sự nghiệp" },
                    { value: "Đất sử dụng cho mục đích công cộng", label: "Đất sử dụng cho mục đích công cộng" },
                    { value: "Đất sản xuất, kinh doanh phi nông nghiệp", label: "Đất sản xuất, kinh doanh phi nông nghiệp" },
                    { value: "Đất lâm nghiệp", label: "Đất lâm nghiệp" },
                ]}
            />

            <Select
                placeholder="Trạng thái"
                style={{ width: 150 }}
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
                style={{
                    flexShrink: 0
                }}
                onClick={onSearch}
            >
                🔍 Tìm kiếm
            </Button>

            <Button
                style={{
                    flexShrink: 0
                }}
                onClick={onReset}
            >
                Reset
            </Button>

        </div>
    );
}