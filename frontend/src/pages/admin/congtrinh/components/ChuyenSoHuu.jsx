import {
  Modal,
  Form,
  Select,
  Button,
  Input,
  Table,
  InputNumber,
  message,
  DatePicker,
} from "antd";

import { useEffect } from "react";

import dayjs from "dayjs";

export default function ChuyenSoHuu({
  open,
  onClose,
  onSubmit,
  onSearchCCCD,
  chuSoHuuMoi,
  selectedOwner,
}) {
  const [form] = Form.useForm();

  // ================= RESET =================

  useEffect(() => {
    if (!open) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ngay_bien_dong: dayjs(),

        nguoi_tao: Number(localStorage.getItem("user_id")) || null,
      });
    }
  }, [open, form]);

  // ================= SUBMIT =================

  const handleSubmit = (values) => {
    if (!values.chu_so_huu_moi_id) {
      message.error("Vui lòng nhập CCCD chủ sở hữu mới");

      return;
    }

    if (!selectedOwner?.chu_so_huu_id) {
      message.error("Thiếu chủ sở hữu hiện tại");

      return;
    }

    const enrichedValues = {
      ...values,

      ngay_bien_dong: values.ngay_bien_dong
        ? values.ngay_bien_dong.format("YYYY-MM-DD")
        : null,

      nguoi_tao: Number(localStorage.getItem("user_id")) || null,

      chu_so_huu_cu_id: selectedOwner.chu_so_huu_id,
    };

    onSubmit(enrichedValues);

    form.resetFields();

    onClose();
  };

  // ================= SEARCH =================

  const handleSearch = async (e) => {
    const value = e.target.value?.trim();

    if (!value) {
      form.setFieldsValue({
        chu_so_huu_moi_id: null,
      });

      return;
    }

    if (value.length < 9) return;

    try {
      const res = await onSearchCCCD(value);

      const owner = Array.isArray(res) ? res[0] : res;

      form.setFieldsValue({
        chu_so_huu_moi_id: owner?.id || null,
      });
    } catch (err) {
      console.log(err);

      form.setFieldsValue({
        chu_so_huu_moi_id: null,
      });
    }
  };

  return (
    <Modal
      title="Chuyển nhượng tài sản"
      open={open}
      onCancel={onClose}
      footer={null}
      width={950}
      destroyOnHidden
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* ================= OWNER CURRENT ================= */}

        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            background: "#fff7e6",
            border: "1px solid #ffd591",
          }}
        >
          <b>👤 Chủ sở hữu hiện tại</b>

          <div>{selectedOwner?.ho_ten}</div>

          <div>CCCD: {selectedOwner?.so_cccd}</div>

          <div>Tỷ lệ: {selectedOwner?.ty_le_so_huu}%</div>
        </div>

        {/* hidden */}

        <Form.Item name="chu_so_huu_moi_id" hidden>
          <Input />
        </Form.Item>

        {/* ================= INFO ================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <Form.Item
            name="loai_giao_dich"
            label="Loại giao dịch"
            initialValue="chuyen_nhuong"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                { value: "Mua Bán", label: "🔄 Mua bán" },
                { value: "Tặng cho", label: "🎁 Tặng cho" },
                { value: "Thừa kế", label: "📜 Thừa kế" },
                { value: "Cho thuê", label: "🏠 Cho thuê" },
                { value: "Thế chấp", label: "🏦 Thế chấp" },
                { value: "Góp vốn", label: "🤝 Góp vốn" },
              ]}
            />
          </Form.Item>

          <Form.Item name="gia_tri_giao_dich" label="Giá trị">
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </div>

        {/* ================= SEARCH NEW OWNER ================= */}

        <div
          style={{
            marginTop: 12,
          }}
        >
          <Input
            placeholder="Nhập CCCD..."
            onChange={handleSearch}
            style={{
              width: 300,
              marginBottom: 10,
            }}
          />

          <Table
            size="small"
            pagination={false}
            rowKey={(record) => record.id}
            dataSource={chuSoHuuMoi ? [chuSoHuuMoi] : []}
            columns={[
              {
                title: "Họ tên",
                dataIndex: "ho_ten",
              },
              {
                title: "CCCD",
                dataIndex: "so_cccd",
              },
              {
                title: "SĐT",
                dataIndex: "so_dien_thoai",
              },
            ]}
          />
        </div>

        {/* ================= % ================= */}

        <Form.Item
          name="ty_le_chuyen"
          label="Tỷ lệ chuyển (%)"
          initialValue={selectedOwner?.ty_le_so_huu}
        >
          <InputNumber
            min={1}
            max={100}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        {/* ================= DATE ================= */}

        <Form.Item
          name="ngay_bien_dong"
          label="Ngày biến động"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker
            style={{
              width: "100%",
            }}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        {/* ================= NOTE ================= */}

        <Form.Item name="ghi_chu" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* ================= ACTION ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <Button onClick={onClose}>Hủy</Button>

          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
