import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Space,
  message,
} from "antd";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/user.service";

export default function User() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const [filters, setFilters] = useState({
    keyword: "",
    role: null,
    status: null,
  });

  // ================= LOAD =================
  const fetchData = async () => {
    try {
      const res = await getUsers();
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILTER =================
  const filteredData = data.filter((u) => {
    const matchKeyword =
      !filters.keyword ||
      u.username?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      u.email?.toLowerCase().includes(filters.keyword.toLowerCase());

    const matchRole = !filters.role || u.role === filters.role;

    const matchStatus = !filters.status || u.status === filters.status;

    return matchKeyword && matchRole && matchStatus;
  });

  // ================= ADD =================
  const handleAdd = () => {
    setSelected(null);
    form.resetFields();
    setOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    form.resetFields();
  };

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      if (selected) {
        await updateUser(selected.id, values);
        message.success("Cập nhật thành công");
      } else {
        await createUser(values);
        message.success("Thêm thành công");
      }

      handleClose();
      fetchData();
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa người dùng này?",
      okType: "danger",
      centered: true,

      onOk: async () => {
        await deleteUser(id);
        message.success("Đã xóa");
        handleClose();
        fetchData();
      },
    });
  };

  // ================= STATUS TAG =================
  const statusTag = (v) => {
    if (v === "active") return <Tag color="green">Hoạt động</Tag>;
    if (v === "inactive") return <Tag color="red">Không hoạt động</Tag>;
    return <Tag>{v}</Tag>;
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <Space
        style={{
          marginBottom: 12,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <h2>👤 Danh sách người dùng</h2>

        <Button type="primary" onClick={handleAdd}>
          + Thêm
        </Button>
      </Space>

      {/* FILTER */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Input
            placeholder="Tìm username / tên / email"
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, keyword: e.target.value }))
            }
          />
        </Col>

        <Col span={8}>
          <Select
            allowClear
            placeholder="Lọc quyền"
            style={{ width: "100%" }}
            value={filters.role}
            onChange={(val) => setFilters((prev) => ({ ...prev, role: val }))}
            options={[
              { value: "admin", label: "Admin" },
              { value: "canbo", label: "Cán bộ" },
              { value: "user", label: "Người dùng" },
            ]}
          />
        </Col>

        <Col span={8}>
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            style={{ width: "100%" }}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={[
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Không hoạt động" },
            ]}
          />
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        rowKey="id"
        dataSource={filteredData}
        pagination={{ pageSize: 7 }}
        onRow={(record) => ({
          onClick: () => handleEdit(record),
          style: { cursor: "pointer" },
        })}
        columns={[
          {
            title: "Username",
            dataIndex: "username",
          },
          {
            title: "Họ tên",
            dataIndex: "full_name",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Quyền",
            dataIndex: "role",
            render: (v) => <Tag color="blue">{v}</Tag>,
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: statusTag,
          },
        ]}
      />

      {/* MODAL */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {selected ? "✏️ Cập nhật người dùng" : "➕ Thêm người dùng"}
          </div>
        }
        open={open}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okText={selected ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        centered
        width={720}
        styles={{
          body: { paddingTop: 16 },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* USERNAME + PASSWORD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Nhập username" }]}
            >
              <Input placeholder="vd: admin01" disabled={!!selected} />
            </Form.Item>

            {!selected && (
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Nhập mật khẩu" }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
            )}
          </div>

          {/* INFO SECTION */}
          <div
            style={{
              marginTop: 8,
              padding: 12,
              border: "1px solid #eef2f7",
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 10 }}>
              Thông tin cá nhân
            </div>

            <Form.Item
              name="full_name"
              label="Họ tên"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="098xxxxxxx" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input placeholder="example@gmail.com" />
            </Form.Item>
          </div>

          {/* ROLE + STATUS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
            <Form.Item name="role" label="Quyền hệ thống">
              <Select
                placeholder="Chọn quyền"
                options={[
                  { value: "admin", label: "👑 Admin" },
                  { value: "canbo", label: "🧑‍💼 Cán bộ" },
                  { value: "user", label: "👤 Người dùng" },
                ]}
              />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: "active", label: "🟢 Hoạt động" },
                  { value: "inactive", label: "🔴 Không hoạt động" },
                ]}
              />
            </Form.Item>
          </div>
        </Form>

        {/* DELETE ACTION */}
        {selected && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#999", fontSize: 13 }}>
              ⚠️ Hành động nguy hiểm
            </span>

            <Button danger onClick={() => handleDelete(selected.id)}>
              Xóa người dùng
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
