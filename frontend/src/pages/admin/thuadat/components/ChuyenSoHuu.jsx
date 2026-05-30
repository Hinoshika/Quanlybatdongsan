import {
    Modal,
    Form,
    Select,
    Button,
    Input,
    Table,
    InputNumber,
    message,
    DatePicker
} from "antd";

import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

export default function ChuyenSoHuu({
    open,
    onClose,
    onSubmit,
    onSearchCCCD,
    chuSoHuuMoi,
    selectedOwner
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            form.resetFields();
        } else {
            form.setFieldsValue({
                ngay_bien_dong: dayjs(),
                nguoi_tao: localStorage.getItem("user_id") || "system"
            });
        }
    }, [open]);

    // ================= SEARCH DEBOUNCE =================
    const handleSearch = useMemo(() =>
        debounce(async (e) => {
            const value = e.target.value?.trim();

            if (!value || value.length < 9) {
                form.setFieldsValue({ chu_so_huu_moi_id: null });
                return;
            }

            try {
                const res = await onSearchCCCD(value);
                const owner = Array.isArray(res) ? res[0] : res;

                form.setFieldsValue({
                    chu_so_huu_moi_id: owner?.id || null
                });
            } catch (err) {
                form.setFieldsValue({ chu_so_huu_moi_id: null });
            }
        }, 400)
        , []);

    // ================= SUBMIT =================
    const handleSubmit = (values) => {

        // ================= VALIDATE NEW OWNER =================
        if (!values.chu_so_huu_moi_id) {
            message.error("Vui lòng nhập CCCD chủ sở hữu mới");
            return;
        }

        // ================= VALIDATE CURRENT OWNER =================
        if (!selectedOwner?.owner_id) {
            message.error("Thiếu ID chủ sở hữu hiện tại");
            return;
        }

        // ================= VALIDATE % =================
        if (!values.ty_le_chuyen || values.ty_le_chuyen <= 0) {
            message.error("Tỷ lệ chuyển không hợp lệ");
            return;
        }

        if (values.ty_le_chuyen > selectedOwner?.ty_le_so_huu) {
            message.error("Không được chuyển vượt quá tỷ lệ hiện tại");
            return;
        }

        // ================= SELF TRANSFER FIX =================
        if (
            Number(selectedOwner?.owner_id) ===
            Number(values.chu_so_huu_moi_id)
        ) {
            message.error("Không thể chuyển cho chính mình");
            return;
        }

        // ================= BUILD PAYLOAD (IMPORTANT FIX HERE) =================
        const enrichedValues = {
            ...values,

            ngay_bien_dong: values.ngay_bien_dong
                ? values.ngay_bien_dong.format("YYYY-MM-DD")
                : null,

            nguoi_tao: localStorage.getItem("user_id") || "system",

            chu_so_huu_cu_id: selectedOwner.owner_id
        };

        onSubmit(enrichedValues);

        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Chuyển nhượng tài sản"
            open={open}
            onCancel={onClose}
            footer={null}
            width={950}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>

                {/* CURRENT OWNER */}
                <div style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 8,
                    background: "#fff7e6",
                    border: "1px solid #ffd591"
                }}>
                    <b>👤 Chủ sở hữu hiện tại</b>

                    <div>Họ tên: {selectedOwner?.ho_ten}</div>
                    <div>CCCD: {selectedOwner?.so_cccd}</div>
                    <div>Tỷ lệ: {selectedOwner?.ty_le_so_huu}%</div>

                    {/* ⭐ NEW FIELD ADDED */}
                    {/* <div style={{ marginTop: 6, fontWeight: 500 }}>
                        🆔 ID sở hữu: {selectedOwner?.owner_id}
                    </div> */}
                </div>
                <Form.Item name="chu_so_huu_moi_id" hidden>
                    <Input />
                </Form.Item>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                    <Form.Item name="loai_giao_dich" label="Loại giao dịch" initialValue="chuyen_nhuong">
                        <Select options={[
                            { value: "mua_ban", label: "💰 Mua bán" },
                            { value: "chuyen_nhuong", label: "🔄 Chuyển nhượng" },
                            { value: "tang_cho", label: "🎁 Tặng cho" },
                            { value: "thua_ke", label: "📜 Thừa kế" }
                        ]} />
                    </Form.Item>

                    <Form.Item name="gia_tri_giao_dich" label="Giá trị">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </div>

                <Input
                    placeholder="Nhập CCCD..."
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />

                <Table
                    size="small"
                    pagination={false}
                    rowKey={(r) => r.id || r.so_cccd}
                    dataSource={chuSoHuuMoi ? [chuSoHuuMoi] : []}
                    columns={[
                        { title: "Họ tên", dataIndex: "ho_ten" },
                        { title: "CCCD", dataIndex: "so_cccd" },
                        { title: "SĐT", dataIndex: "so_dien_thoai" }
                    ]}
                />

                <Form.Item name="ty_le_chuyen" label="Tỷ lệ chuyển (%)">
                    <InputNumber min={1} max={100} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="ngay_bien_dong" label="Ngày biến động" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item name="ghi_chu" label="Ghi chú">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                        Xác nhận
                    </Button>
                </div>

            </Form>
        </Modal>
    );
}