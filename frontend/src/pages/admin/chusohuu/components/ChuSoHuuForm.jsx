import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
} from "antd";

import { useEffect } from "react";

export default function ChuSoHuuForm({
  open,
  mode,
  selected,
  onClose,
  onSubmit,
  onDelete,
  onCheckTaiSan,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    } else {
      form.resetFields();
    }
  }, [selected]);

  return (
    <Modal
      title={mode === "edit" ? "Chi tiết chủ sở hữu" : "Thêm chủ sở hữu"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={mode === "edit" ? "Lưu" : "Thêm"}
      cancelText="Hủy"
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="so_cccd"
            label="CCCD / Mã số thuế"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập CCCD / Mã số thuế",
              },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "CCCD / Mã số thuế phải từ 10 đến 15 số",
              },
            ]}
          >
            <Input
              style={{
                width: "100%",
              }}
              maxLength={15}
              placeholder="Nhập 10-15 chữ số"
            />
          </Form.Item>

          <Form.Item
            name="so_dien_thoai"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "số điện thoại từ 10 đến 15 số",
              },
            ]}
          >
            <Input
              style={{
                width: "100%",
              }}
              maxLength={15}
              placeholder="Nhập 10-15 chữ số"
            />
          </Form.Item>

          <Form.Item name="ngay_sinh" label="Ngày sinh">
            <DatePicker
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item name="dia_chi" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="loai" label="Loại">
            <Select
              options={[
                {
                  value: "ca_nhan",
                  label: "Cá nhân",
                },
                {
                  value: "to_chuc",
                  label: "Tổ chức",
                },
              ]}
            />
          </Form.Item>
        </div>

        {mode === "edit" && selected && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
            }}
          >
            <Button type="primary" onClick={onCheckTaiSan}>
              ➜ Xem tài sản
            </Button>

            <Button danger onClick={() => onDelete(selected.id)}>
              Xóa
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
}
