import { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Modal,
    Descriptions,
    Select,
    message,
    Popconfirm,
    Button
} from "antd";
import dayjs from "dayjs";

import {
    getYeuCau,
    deleteYeuCau
} from "../../../services/yeucau.service";

export default function RequestUser() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [filter, setFilter] = useState("TẤT_CẢ");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getYeuCau();
            const list = res?.data || res;
            setData(list);
        } catch (err) {
            message.error("Không tải được dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // HỦY YÊU CẦU
    // =========================
    const handleCancel = async (record) => {
        try {
            await deleteYeuCau(record.id);

            message.success("Đã hủy yêu cầu");

            setData(prev =>
                prev.map(item =>
                    item.id === record.id
                        ? { ...item, trang_thai: "DA_HUY" }
                        : item
                )
            );

            setOpenDetail(false);
            setSelected(null);

        } catch (err) {
            message.error("Hủy thất bại");
        }
    };

    // =========================
    // STATUS UI
    // =========================
    const getColor = (v) => {
        switch (v) {
            case "CHO_XU_LY": return "orange";
            case "DA_DUYET": return "green";
            case "TU_CHOI": return "red";
            case "DA_HUY": return "gray";
            default: return "default";
        }
    };

    const getLabel = (v) => {
        switch (v) {
            case "CHO_XU_LY": return "Chờ xử lý";
            case "DA_DUYET": return "Đã duyệt";
            case "TU_CHOI": return "Từ chối";
            case "DA_HUY": return "Đã hủy";
            default: return v;
        }
    };

    const columns = [
        {
            title: "Loại yêu cầu",
            dataIndex: "loai_yeu_cau"
        },
        {
            title: "Trạng thái",
            dataIndex: "trang_thai",
            render: (v) => (
                <Tag color={getColor(v)}>
                    {getLabel(v)}
                </Tag>
            )
        },
        {
            title: "Ngày tạo",
            dataIndex: "ngay_gui",
            render: (v) =>
                v ? dayjs(v).format("DD/MM/YYYY") : ""
        }
    ];

    const filteredData =
        filter === "TẤT_CẢ"
            ? data
            : data.filter(i => i.trang_thai === filter);

    return (
        <div style={{ padding: 20 }}>

            <h2>📄 Yêu cầu của tôi</h2>

            {/* FILTER */}
            <Select
                value={filter}
                onChange={setFilter}
                style={{ width: 220, marginBottom: 16 }}
                options={[
                    { value: "TẤT_CẢ", label: "Tất cả" },
                    { value: "CHO_XU_LY", label: "Chờ xử lý" },
                    { value: "DA_DUYET", label: "Đã duyệt" },
                    { value: "TU_CHOI", label: "Từ chối" },
                    { value: "DA_HUY", label: "Đã hủy" }
                ]}
            />

            {/* TABLE (CLICK ROW ĐỂ XEM) */}
            <Table
                rowKey="id"
                dataSource={filteredData}
                columns={columns}
                loading={loading}
                onRow={(record) => ({
                    onClick: () => {
                        setSelected(record);
                        setOpenDetail(true);
                    },
                    style: { cursor: "pointer" }
                })}
            />

            {/* DETAIL MODAL */}
            <Modal
                open={openDetail}
                onCancel={() => {
                    setOpenDetail(false);
                    setSelected(null);
                }}
                footer={null}
                centered
                width={850}
                styles={{
                    body: {
                        padding: 0,
                        borderRadius: 12,
                        overflow: "hidden"
                    }
                }}
            >
                {selected && (
                    <div style={{ background: "#f6f7fb" }}>

                        {/* HEADER */}
                        <div
                            style={{
                                padding: 20,
                                background: "linear-gradient(135deg, #1677ff, #4096ff)",
                                color: "#fff"
                            }}
                        >
                            <div style={{ fontSize: 18, fontWeight: 600 }}>
                                {selected.loai_yeu_cau}
                            </div>

                            <div
                                style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    opacity: 0.9
                                }}
                            >
                                Mã yêu cầu: #{selected.id}
                            </div>

                            <div style={{ marginTop: 10 }}>
                                <Tag
                                    style={{
                                        borderRadius: 20,
                                        padding: "2px 12px",
                                        fontWeight: 500
                                    }}
                                    color={
                                        selected.trang_thai === "CHO_XU_LY"
                                            ? "orange"
                                            : selected.trang_thai === "DA_DUYET"
                                                ? "green"
                                                : selected.trang_thai === "TU_CHOI"
                                                    ? "red"
                                                    : "default"
                                    }
                                >
                                    {getLabel(selected.trang_thai)}
                                </Tag>
                            </div>
                        </div>

                        {/* BODY */}
                        <div style={{ padding: 20 }}>

                            {/* Nội dung */}
                            <div
                                style={{
                                    background: "#fff",
                                    padding: 16,
                                    borderRadius: 10,
                                    marginBottom: 12,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                    Nội dung yêu cầu
                                </div>
                                <div style={{ color: "#555", lineHeight: 1.6 }}>
                                    {selected.noi_dung}
                                </div>
                            </div>

                            {/* Phản hồi */}
                            <div
                                style={{
                                    background: "#fff",
                                    padding: 16,
                                    borderRadius: 10,
                                    marginBottom: 12,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                    Phản hồi xử lý
                                </div>

                                <div style={{ color: selected.ghi_chu_xu_ly ? "#333" : "#999" }}>
                                    {selected.ghi_chu_xu_ly || "Chưa có phản hồi"}
                                </div>
                            </div>

                            {/* Thời gian */}
                            <div
                                style={{
                                    background: "#fff",
                                    padding: 16,
                                    borderRadius: 10,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                    Thời gian tạo
                                </div>
                                <div style={{ color: "#666" }}>
                                    {dayjs(selected.ngay_gui).format("DD/MM/YYYY HH:mm")}
                                </div>
                            </div>

                            {/* ACTION */}
                            {selected.trang_thai === "CHO_XU_LY" && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: 16
                                    }}
                                >
                                    <Popconfirm
                                        title="Bạn có chắc muốn hủy yêu cầu?"
                                        okText="Hủy"
                                        cancelText="Không"
                                        onConfirm={() => handleCancel(selected)}
                                    >
                                        <Button danger size="middle">
                                            Hủy yêu cầu
                                        </Button>
                                    </Popconfirm>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}