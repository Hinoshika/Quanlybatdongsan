import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Tabs } from "antd";

import ChuSoHuuTable from "./ChuSoHuuTable";
import CongTrinhTable from "./CongTrinhTable";
import ThuaDatMap from "./ThuaDatMap";

export default function ThuaDatModal({
    open,
    onClose,
    selected,
    detail,
    onSubmit,
    onOpenCongTrinh,
    onOpenTransfer,
    mode = "edit"
}) {
    const [form] = Form.useForm();

    const isCreate = mode === "create";

    useEffect(() => {
        if (!isCreate && selected) {
            form.setFieldsValue({
                so_thua: selected.so_thua,
                so_to_ban_do: selected.so_to_ban_do,
                loai_dat: selected.loai_dat,
                dien_tich: selected.dien_tich,
                trang_thai: selected.trang_thai,
                tinh: selected.tinh,
                dia_chi: selected.dia_chi,
                muc_dich_su_dung: selected.muc_dich_su_dung,
                hinh_thuc_su_dung: selected.hinh_thuc_su_dung,
                thoi_han_su_dung: selected.thoi_han_su_dung,
                nguon_goc_su_dung: selected.nguon_goc_su_dung
            });
        } else {
            form.resetFields();
        }
    }, [selected, isCreate]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            title={"📍 Thông tin thửa đất"}
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText={isCreate ? "Thêm" : "Lưu"}
            width={900}
            destroyOnClose
        >
            {/* ================= FORM THỬA ĐẤT ================= */}
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12
                }}>

                    <Form.Item
                        name="so_thua"
                        label="Số thửa"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="so_to_ban_do"
                        label="Số tờ bản đồ"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="loai_dat"
                        label="Loại đất"
                        rules={[{ required: true }]}
                    >
                        <Select options={[
                            { value: "Đất ở", label: "Đất ở" },
                            { value: "Đất nông nghiệp", label: "Đất nông nghiệp" },
                            { value: "Đất thương mại", label: "Đất thương mại" },
                            { value: "Đất xây dựng trụ sở cơ quan", label: "Đất xây dựng trụ sở cơ quan." },
                            { value: "Đất quốc phòng, an ninh", label: "Đất quốc phòng, an ninh." },
                            { value: "Đất xây dựng công trình sự nghiệp", label: "Đất xây dựng công trình sự nghiệp" },
                            { value: "Đất sử dụng cho mục đích công cộng", label: "Đất sử dụng cho mục đích công cộng" },
                            { value: "Đất sản xuất, kinh doanh phi nông nghiệp", label: "Đất sản xuất, kinh doanh phi nông nghiệp" },
                            { value: "Đất lâm nghiệp", label: "Đất lâm nghiệp" },
                        ]} />
                    </Form.Item>

                    <Form.Item
                        name="dien_tich"
                        label="Diện tích"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="tinh"
                        label="Tỉnh"
                        rules={[{ required: true }]}
                    >
                        <Select options={[
                            { value: "TP Hà Nội", label: "TPHà Nội" },
                            { value: "TP HCM", label: "TP Hồ Chí Minh" },
                            { value: "TP Đà Nẵng", label: "TP Đà Nẵng" },
                            { value: "TP. Hải Phòng", label: "TP. Hải Phòng" },
                            { value: "TP HCM", label: "TP Hồ Chí Minh" },
                            { value: "TP. Cần Thơ", label: "TP. Cần Thơ" },
                            { value: "TP. Huế", label: "TP. Huế" },
                            { value: "Tuyên Quang", label: "Tuyên Quang" },
                            { value: "Lào Cai", label: "Lào Cai" },
                        ]} />
                    </Form.Item>

                    <Form.Item
                        name="dia_chi"
                        label="Địa chỉ"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="muc_dich_su_dung"
                        label="Mục đích sử dụng"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="hinh_thuc_su_dung"
                        label="Hình thức sử dụng"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="thoi_han_su_dung"
                        label="Thời hạn sử dụng"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="nguon_goc_su_dung"
                        label="Nguồn gốc sử dụng"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="trang_thai"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select options={[
                            { value: "Đang sử dụng", label: "Đang sử dụng" },
                            { value: "Chưa sử dụng", label: "Chưa sử dụng" },
                            { value: "Tranh chấp", label: "Tranh chấp" },
                            { value: "Thu hồi", label: "Thu hồi" }
                        ]} />
                    </Form.Item>
                </div>
            </Form>

            {/* ================= DETAIL SECTION ================= */}
            {!isCreate && (
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: "1",
                            label: "👤 Chủ sở hữu",
                            children: (
                                <ChuSoHuuTable
                                    detail={detail}
                                    onOpenTransfer={onOpenTransfer}
                                />
                            )
                        },
                        {
                            key: "2",
                            label: "🏗 Công trình",
                            children: (
                                <>
                                    <CongTrinhTable detail={detail} />

                                    <div style={{ marginTop: 12 }}>
                                        <button
                                            onClick={onOpenCongTrinh}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#1677ff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6
                                            }}
                                        >
                                            ➕ Thêm công trình
                                        </button>
                                    </div>
                                </>
                            )
                        },
                        {
                            key: "3",
                            label: "🗺 Bản đồ",
                            children: (
                                <ThuaDatMap selected={selected} />
                            )
                        }
                    ]}
                />
            )}
        </Modal>
    );
}