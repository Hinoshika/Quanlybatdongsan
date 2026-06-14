import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../../services/user.service";

export default function User() {

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form] = Form.useForm();

    // LOAD DATA
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

    // ADD
    const handleAdd = () => {
        setSelected(null);
        form.resetFields();
        setOpen(true);
    };

    // EDIT
    const handleEdit = (record) => {
        setSelected(record);
        form.setFieldsValue(record);
        setOpen(true);
    };

    // CLOSE
    const handleClose = () => {
        setOpen(false);
        setSelected(null);
        form.resetFields();
    };

    // SUBMIT (THÊM + SỬA)
    const handleSubmit = async (values) => {
        console.log("SUBMIT:", values);

        if (!values.username) {
            return;
        }

        if (!selected && !values.password) {
            return;
        }

        try {
            if (selected) {
                await updateUser(selected.id, values);
            } else {
                await createUser(values);
            }

            handleClose();
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    // DELETE
    const handleDelete = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa người dùng này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            centered: true,

            onOk: async () => {
                await deleteUser(id);
                handleClose();   // đóng modal
                fetchData();     // reload data
            }
        });
    };

    return (
        <div style={{ padding: 24 }}>

            <h2>👤 Danh sách người dùng</h2>

            <Button type="primary" onClick={handleAdd}>
                + Thêm người dùng
            </Button>

            {/* TABLE */}
            <Table
                style={{ marginTop: 12 }}
                rowKey="id"
                dataSource={data}
                columns={[
                    { title: "Username", dataIndex: "username" },
                    { title: "Họ tên", dataIndex: "full_name" },
                    { title: "Email", dataIndex: "email" },
                    { title: "Quyền hạn", dataIndex: "role" },
                    { title: "Trạng thái", dataIndex: "status" }
                ]}
                pagination={{ pageSize: 6 }}
                onRow={(record) => ({
                    onClick: () => handleEdit(record)
                })}
            />

            {/* MODAL */}
            <Modal
                title={selected ? "Thông tin người dùng" : "Thêm người dùng"}
                open={open}
                onCancel={handleClose}
                onOk={() => form.submit()}
                okText={selected ? "Lưu" : "Thêm"}
                cancelText="Hủy"
                width={800}
            >

                <Form form={form} layout="vertical" onFinish={handleSubmit}>

                    <Form.Item name="username" label="Username">
                        <Input disabled={!!selected} />
                    </Form.Item>

                    {!selected && (
                        <Form.Item name="password" label="Password">
                            <Input.Password />
                        </Form.Item>
                    )}

                    <Form.Item name="full_name" label="Họ tên">
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>

                    <Form.Item name="role" label="Quyền hạn">
                        <Select options={[
                            { value: "admin", label: "Admin" },
                            { value: "canbo", label: "Cán bộ" },
                            { value: "user", label: "Người dùng" }
                        ]} />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select options={[
                            { value: "active", label: "Hoạt động" },
                            { value: "inactive", label: "Không hoạt động" }
                        ]} />
                    </Form.Item>

                </Form>

                {/* DELETE */}
                {selected && (
                    <div style={{ marginTop: 16 }}>
                        <Button
                            danger
                            onClick={() => handleDelete(selected.id)}
                        >
                            Xóa Người dùng
                        </Button>
                    </div>
                )}

            </Modal>

        </div>
    );
}