import { useEffect, useState } from "react";
import { Table, Tag, Modal, DatePicker, Select, InputNumber, Row, Col, Button } from "antd";
import dayjs from "dayjs";

import {
    getBienDong,
    getBienDongById
} from "../../../services/bienDong.service";

const { RangePicker } = DatePicker;

export default function BienDong() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState(null);
    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState({
        date: null,
        type: null,
        minValue: null,
        maxValue: null
    });

    // LOAD DATA
    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const res = await getBienDong(params);
            setData(res.data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // VIEW DETAIL
    const handleView = async (id) => {
        try {
            const res = await getBienDongById(id);
            setDetail(res.data);
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    // APPLY FILTER
    const handleFilter = () => {

        const params = {};

        if (filters.type) {
            params.loai_bien_dong = filters.type;
        }

        if (filters.date && filters.date.length === 2) {
            params.from_date = filters.date[0].format("YYYY-MM-DD");
            params.to_date = filters.date[1].format("YYYY-MM-DD");
        }

        if (filters.minValue != null) {
            params.min_gia_tri = filters.minValue;
        }

        if (filters.maxValue != null) {
            params.max_gia_tri = filters.maxValue;
        }
        console.log(params);
        fetchData(params);
    };

    // RESET FILTER
    const handleReset = () => {
        setFilters({
            date: null,
            type: null,
            minValue: null,
            maxValue: null
        });

        fetchData();
    };

    const columns = [
        {
            title: "Ngày biến động",
            dataIndex: "ngay_bien_dong",
            render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "-"
        },
        {
            title: "Loại",
            dataIndex: "loai_bien_dong",
            render: (t) => {
                const color =
                    t === "CHUYEN_NHUONG" ? "red" :
                        t === "CAP_NHAT" ? "orange" :
                            t === "TAO_MOI" ? "green" :
                                t === "XOA" ? "gray" : "blue";

                return <Tag color={color}>{t}</Tag>;
            }
        },
        {
            title: "Giá trị",
            dataIndex: "gia_tri_giao_dich",
            render: (v) =>
                v ? Number(v).toLocaleString() + " đ" : "-"
        },
        {
            title: "Người tạo",
            dataIndex: "nguoi_tao",
            render: (v) => v || "-"
        }
    ];

    return (
        <div style={{ padding: 16 }}>

            <h2>📊 Quản lý biến động</h2>

            {/* FILTER */}
            <Row gutter={12} style={{ marginBottom: 16 }}>

                <Col>
                    <RangePicker
                        value={filters.date}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, date: val }))
                        }
                    />
                </Col>

                <Col>
                    <Select
                        placeholder="Loại biến động"
                        allowClear
                        style={{ width: 180 }}
                        value={filters.type}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, type: val }))
                        }
                    >
                        <Select.Option value="CHUYEN_NHUONG">Chuyển nhượng</Select.Option>
                        <Select.Option value="BÁN">Bán</Select.Option>
                        <Select.Option value="TAO_MOI">Tạo mới</Select.Option>
                        <Select.Option value="XOA">Xóa</Select.Option>
                    </Select>
                </Col>

                <Col>
                    <InputNumber
                        placeholder="Giá trị từ"
                        style={{ width: 150 }}
                        value={filters.minValue}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, minValue: val }))
                        }
                    />
                </Col>

                <Col>
                    <InputNumber
                        placeholder="Giá trị đến"
                        style={{ width: 150 }}
                        value={filters.maxValue}
                        onChange={(val) =>
                            setFilters(prev => ({ ...prev, maxValue: val }))
                        }
                    />
                </Col>

                <Col>
                    <Button type="primary" onClick={handleFilter}>
                        🔍 Lọc
                    </Button>
                </Col>

                <Col>
                    <Button onClick={handleReset}>
                        ♻ Reset
                    </Button>
                </Col>

            </Row>

            {/* TABLE */}
            <Table
                loading={loading}
                dataSource={data}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleView(record.id),
                    style: { cursor: "pointer" }
                })}
            />

            {/* MODAL */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={900}
                title="Chi tiết biến động"
            >
                {detail && (
                    <div>
                        <p><b>Loại:</b> {detail.loai_bien_dong}</p>
                        <p><b>Giá trị:</b> {detail.gia_tri_giao_dich}</p>
                        <p><b>Người tạo:</b> {detail.nguoi_tao}</p>
                    </div>
                )}
            </Modal>

        </div>
    );
}