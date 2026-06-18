import { useEffect, useState } from "react";

import {
  Card,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Descriptions,
  message,
  Space,
  Image,
  Typography,
  Button,
  Steps,
  Divider,
  Row,
  Col,
  Upload,
  Select,
  DatePicker,
} from "antd";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import { getYeuCau, updateYeuCau } from "../../../services/yeucau.service";

import { taoVanBan } from "../../../services/vanban.service";

const { TextArea } = Input;

const { Text, Link } = Typography;

const API_FILE = "http://localhost:5000/";

export default function XuLyYeuCau() {
  const [data, setData] = useState([]);

  const [selected, setSelected] = useState(null);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [isProcessing, setIsProcessing] = useState(false);

  // file cán bộ upload
  const [replyFiles, setReplyFiles] = useState([]);

  // ============================
  // LOAD DATA
  // ============================

  const fetchData = async () => {
    try {
      setLoading(true);

      const result = await getYeuCau();

      setData(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(fetchData, 5000);

    return () => clearInterval(timer);
  }, []);

  const [filters, setFilters] = useState({
    keyword: "",
    trang_thai: null,
    loai_yeu_cau: null,
  });

  const filteredData = data.filter((item) => {
    const keyword = filters.keyword
      ? item.nguoi_gui?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        item.loai_yeu_cau?.toLowerCase().includes(filters.keyword.toLowerCase())
      : true;

    const status = filters.trang_thai
      ? item.trang_thai === filters.trang_thai
      : true;

    const type = filters.loai_yeu_cau
      ? item.loai_yeu_cau === filters.loai_yeu_cau
      : true;

    return keyword && status && type;
  });

  const resetFilter = () => {
    setFilters({
      keyword: "",

      trang_thai: null,

      loai_yeu_cau: null,
    });
  };

  // ============================
  // OPEN DETAIL
  // ============================
  const handleOpen = (record) => {
    setSelected(record);

    form.setFieldsValue({
      ghi_chu_xu_ly: record.ghi_chu_xu_ly || "",
    });

    setReplyFiles([]);

    // chưa xử lý thì ẩn form
    setIsProcessing(record.trang_thai !== "CHO_XU_LY");

    setOpen(true);
  };

  const updateStatus = async (status) => {
    try {
      console.log("STATUS GỬI:", status);

      const formData = new FormData();

      formData.append("trang_thai", status);
      formData.append(
        "ghi_chu_xu_ly",
        form.getFieldValue("ghi_chu_xu_ly") || "",
      );
      // upload file phản hồi
      replyFiles.forEach((file) => {
        formData.append("van_ban_phan_hoi", file);
      });
      await updateYeuCau(selected.id, formData);
      message.success("Cập nhật trạng thái thành công");
      // cập nhật modal ngay
      setSelected((prev) => ({
        ...prev,
        trang_thai: status,
      }));
      // load lại bảng
      fetchData();
    } catch (err) {
      console.error(err);

      message.error(err.message || "Cập nhật thất bại");
    }
  };
  const handleTaoVanBan = async () => {
    try {
      const res = await taoVanBan(selected.id);

      message.success("Tạo văn bản thành công");

      window.open(API_FILE + res.url, "_blank");
    } catch (error) {
      console.error(error);

      message.error(error.message || "Tạo văn bản thất bại");
    }
  };
  const renderStatus = (status) => {
    switch (status) {
      case "CHO_XU_LY":
        return <Tag color="orange">Chờ xử lý</Tag>;

      case "DANG_XU_LY":
        return <Tag color="blue">Đang xử lý</Tag>;

      case "HOAN_THANH":
        return <Tag color="green">Hoàn thành</Tag>;

      case "TU_CHOI":
        return <Tag color="red">Từ chối</Tag>;

      default:
        return <Tag>{status || "Không xác định"}</Tag>;
    }
  };
  const getStep = () => {
    switch (selected?.trang_thai) {
      case "CHO_XU_LY":
        return 0;

      case "DANG_XU_LY":
        return 1;

      case "HOAN_THANH":
        return 2;

      case "TU_CHOI":
        return 3;

      default:
        return 0;
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "loai_yeu_cau",
    },

    {
      title: "Người gửi",
      dataIndex: "nguoi_gui",
    },

    {
      title: "Trạng thái",
      dataIndex: "trang_thai",

      render: renderStatus,
    },

    {
      title: "Ngày gửi",

      dataIndex: "ngay_gui",

      render: (value) => (value ? new Date(value).toLocaleString("vi-VN") : ""),
    },
  ];

  return (
    <>
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <b>Danh sách yêu cầu</b>
          </Space>
        }
      >
        <>
          <Row
            gutter={16}
            style={{
              marginBottom: 20,
            }}
          >
            <Col span={8}>
              <Input
                placeholder="🔎 Tìm người gửi, loại yêu cầu..."
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({
                    ...filters,

                    keyword: e.target.value,
                  })
                }
              />
            </Col>

            <Col span={5}>
              <Select
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Lọc trạng thái"
                value={filters.trang_thai}
                onChange={(value) =>
                  setFilters({
                    ...filters,

                    trang_thai: value,
                  })
                }
                options={[
                  {
                    label: "Chờ xử lý",
                    value: "CHO_XU_LY",
                  },

                  {
                    label: "Đang xử lý",
                    value: "DANG_XU_LY",
                  },

                  {
                    label: "Hoàn thành",
                    value: "HOAN_THANH",
                  },

                  {
                    label: "Từ chối",
                    value: "TU_CHOI",
                  },
                ]}
              />
            </Col>

            <Col span={5}>
              <Select
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Loại yêu cầu"
                value={filters.loai_yeu_cau}
                onChange={(value) =>
                  setFilters({
                    ...filters,

                    loai_yeu_cau: value,
                  })
                }
                options={[...new Set(data.map((x) => x.loai_yeu_cau))].map(
                  (x) => ({
                    label: x,

                    value: x,
                  }),
                )}
              />
            </Col>

            <Col>
              <Button onClick={resetFilter}>Reset</Button>
            </Col>
          </Row>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              pageSize: 10,
            }}
            onRow={(record) => ({
              onClick: () => handleOpen(record),

              style: {
                cursor: "pointer",
              },
            })}
          />
        </>
      </Card>

      <Modal
        open={open}
        width={1200}
        footer={null}
        title={
          <Space>
            <FileTextOutlined />

            <b>Chi tiết yêu cầu #{selected?.id}</b>

            {selected && renderStatus(selected.trang_thai)}
          </Space>
        }
        onCancel={() => {
          setOpen(false);

          setSelected(null);

          setIsProcessing(false);
        }}
      >
        {selected && (
          <>
            {/* ================= TIẾN TRÌNH ================= */}

            <Card
              style={{
                marginBottom: 20,
              }}
            >
              <Steps
                current={getStep()}
                items={[
                  {
                    title: "Tiếp nhận",
                  },

                  {
                    title: "Đang xử lý",
                  },

                  {
                    title: "Hoàn thành",
                  },

                  {
                    title: "Từ chối",
                  },
                ]}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Thông tin hồ sơ">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Người gửi">
                      {selected.nguoi_gui}
                    </Descriptions.Item>

                    <Descriptions.Item label="Loại yêu cầu">
                      {selected.loai_yeu_cau}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                      {renderStatus(selected.trang_thai)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày gửi">
                      {selected.ngay_gui
                        ? new Date(selected.ngay_gui).toLocaleString("vi-VN")
                        : ""}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tiếp nhận">
                      {selected.ngay_tiep_nhan
                        ? new Date(selected.ngay_tiep_nhan).toLocaleString(
                            "vi-VN",
                          )
                        : "Chưa tiếp nhận"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày hoàn thành">
                      {selected.ngay_hoan_thanh
                        ? new Date(selected.ngay_hoan_thanh).toLocaleString(
                            "vi-VN",
                          )
                        : ""}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Nội dung yêu cầu">
                  <div
                    style={{
                      minHeight: 150,
                      fontSize: 15,
                    }}
                  >
                    {selected.noi_dung || "Không có nội dung"}
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* ================= FILE NGƯỜI DÂN ================= */}

            <Card title="📂 Hồ sơ gửi đến">
              {selected.tep_dinh_kem && selected.tep_dinh_kem.length ? (
                selected.tep_dinh_kem.map((file, index) => {
                  const filename = file.duong_dan.split("/").pop();

                  const url =
                    "http://localhost:5000/api/file/download/" + filename;

                  return (
                    <Card
                      size="small"
                      key={index}
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <Space>
                        <FileTextOutlined />

                        <Link href={url} target="_blank">
                          {file.ten_file}
                        </Link>

                        <Button icon={<DownloadOutlined />} href={url} download>
                          Tải
                        </Button>
                      </Space>

                      {file.loai_file?.startsWith("image/") && (
                        <div
                          style={{
                            marginTop: 10,
                          }}
                        >
                          <Image width={250} src={url} />
                        </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Text type="secondary">Không có hồ sơ</Text>
              )}
            </Card>

            <Divider />

            {/* ================= FORM XỬ LÝ ================= */}

            {isProcessing && (
              <>
                <Card
                  title="📄 Văn bản phản hồi"
                  extra={
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={handleTaoVanBan}
                    >
                      Tạo văn bản
                    </Button>
                  }
                >
                  <Upload
                    multiple
                    beforeUpload={(file) => {
                      setReplyFiles((prev) => [...prev, file]);

                      return false;
                    }}
                    fileList={replyFiles.map((file) => ({
                      uid: file.uid,

                      name: file.name,
                    }))}
                    onRemove={(file) => {
                      setReplyFiles((prev) =>
                        prev.filter((x) => x.uid !== file.uid),
                      );
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Chọn file kết quả</Button>
                  </Upload>
                </Card>

                <Divider />

                <Card title="📝 Nội dung xử lý">
                  <Form form={form} layout="vertical">
                    <Form.Item name="ghi_chu_xu_ly" label="Ghi chú">
                      <TextArea rows={4} placeholder="Nhập nội dung xử lý..." />
                    </Form.Item>
                  </Form>
                </Card>
              </>
            )}

            <Divider />

            {/* ================= BUTTON ================= */}

            <Space>
              {selected.trang_thai === "CHO_XU_LY" && (
                <Button
                  type="primary"
                  size="large"
                  onClick={async () => {
                    await updateStatus("DANG_XU_LY");

                    setIsProcessing(true);
                  }}
                >
                  Tiếp nhận hồ sơ
                </Button>
              )}

              {isProcessing && selected.trang_thai === "DANG_XU_LY" && (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    onClick={() => updateStatus("HOAN_THANH")}
                  >
                    Gửi thông tin
                  </Button>

                  <Button
                    danger
                    size="large"
                    icon={<CloseCircleOutlined />}
                    onClick={() => updateStatus("TU_CHOI")}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </Space>
          </>
        )}
      </Modal>
    </>
  );
}
