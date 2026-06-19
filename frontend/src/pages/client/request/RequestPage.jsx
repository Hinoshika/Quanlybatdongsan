import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Divider,
} from "antd";

import {
  UploadOutlined,
  SendOutlined,
  FileTextOutlined,
  TagsOutlined,
  InboxOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { createYeuCau } from "../../../services/yeucau.service";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function RequestPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      message.warning("Vui lòng đăng nhập để gửi yêu cầu");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("nguoi_gui_id", user.id);
      formData.append("loai_yeu_cau", values.loai_yeu_cau);
      formData.append("noi_dung", values.noi_dung);

      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      await createYeuCau(formData);

      message.success("Gửi yêu cầu thành công");

      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Gửi yêu cầu thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "30px auto",
        padding: "0 16px",
      }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#1677ff,#4096ff)",
            padding: 32,
            color: "#fff",
          }}
        >
          <Title
            level={2}
            style={{
              color: "#fff",
              margin: 0,
            }}
          >
            Gửi yêu cầu hỗ trợ
          </Title>

          <Text
            style={{
              color: "#e8f3ff",
              fontSize: 15,
            }}
          >
            Gửi phản ánh, cập nhật thông tin hoặc yêu cầu hỗ trợ từ cơ quan quản
            lý.
          </Text>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 30,
          }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">Thông tin yêu cầu</Divider>

            <Form.Item
              label="Loại yêu cầu"
              name="loai_yeu_cau"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại yêu cầu",
                },
              ]}
            >
              <Select
                size="large"
                prefix={<TagsOutlined />}
                placeholder="Chọn loại yêu cầu"
                options={[
                  {
                    value: "Cập nhật thửa đất",
                    label: "🏡 Cập nhật thửa đất",
                  },
                  {
                    value: "Cập nhật chủ sở hữu",
                    label: "👤 Cập nhật chủ sở hữu",
                  },
                  {
                    value: "Cập nhật công trình",
                    label: "🏢 Cập nhật công trình",
                  },
                  {
                    value: "Khiếu nại",
                    label: "⚠️ Khiếu nại",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Nội dung chi tiết"
              name="noi_dung"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nội dung",
                },
              ]}
            >
              <TextArea
                rows={6}
                showCount
                maxLength={2000}
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
              />
            </Form.Item>

            <Divider orientation="left">Tài liệu đính kèm</Divider>

            <Dragger
              multiple
              fileList={fileList}
              beforeUpload={(file) => {
                const isLt10M = file.size / 1024 / 1024 < 10;

                if (!isLt10M) {
                  message.error(`${file.name} vượt quá 10MB`);
                  return Upload.LIST_IGNORE;
                }

                return false;
              }}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={10}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined
                  style={{
                    color: "#1677ff",
                  }}
                />
              </p>

              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Kéo thả tệp vào đây
              </p>

              <p
                style={{
                  color: "#888",
                }}
              >
                Hoặc nhấn để chọn file (PDF, DOCX, XLSX, JPG, PNG...)
              </p>
            </Dragger>

            <div
              style={{
                marginTop: 10,
                color: "#888",
              }}
            >
              <FileTextOutlined /> Tối đa 10 tệp, mỗi tệp không vượt quá 10MB
            </div>

            <div
              style={{
                marginTop: 32,
                textAlign: "right",
              }}
            >
              <Space size="middle">
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    form.resetFields();
                    setFileList([]);
                  }}
                >
                  Làm mới
                </Button>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  style={{
                    minWidth: 180,
                    borderRadius: 10,
                  }}
                >
                  Gửi yêu cầu
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
