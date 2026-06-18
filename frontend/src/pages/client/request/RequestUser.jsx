import { useEffect, useState } from "react";

import {
  Table,
  Tag,
  Modal,
  Select,
  message,
  Popconfirm,
  Button,
  Card,
  Space,
  Divider,
  Typography,
  Empty,
} from "antd";

import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { getMyYeuCau, deleteYeuCau } from "../../../services/yeucau.service";

import dayjs from "dayjs";

const { Text, Link } = Typography;

const API_FILE = "http://localhost:5000/";

export default function RequestUser() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);

  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState("ALL");

  // ================= LOAD =================

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // message.warning("Vui lòng đăng nhập");
        return;
      }

      setLoading(true);

      const res = await getMyYeuCau();

      setData(res);
    } catch (err) {
      if (err.message === "No token" || err.message.includes("401")) {
        message.warning("Phiên đăng nhập đã hết hạn");
      } else {
        message.error("Không tải được yêu cầu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(fetchData, 5000);

    return () => clearInterval(timer);
  }, []);

  // ================= HỦY =================

  const handleCancel = async () => {
    try {
      await deleteYeuCau(selected.id);

      message.success("Đã hủy yêu cầu");

      fetchData();

      setOpen(false);
    } catch (err) {
      message.error("Hủy yêu cầu thất bại");
    }
  };

  // ================= STATUS =================

  const statusConfig = {
    CHO_XU_LY: {
      color: "orange",
      label: "Chờ xử lý",
    },

    DANG_XU_LY: {
      color: "blue",
      label: "Đang xử lý",
    },

    HOAN_THANH: {
      color: "green",
      label: "Hoàn thành",
    },

    TU_CHOI: {
      color: "red",
      label: "Từ chối",
    },
  };

  const renderStatus = (status) => {
    return (
      <Tag color={statusConfig[status]?.color}>
        {statusConfig[status]?.label || status}
      </Tag>
    );
  };

  // ================= TABLE =================

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      width: 80,
    },

    {
      title: "Loại yêu cầu",
      dataIndex: "loai_yeu_cau",
    },

    {
      title: "Trạng thái",

      dataIndex: "trang_thai",

      render: renderStatus,
    },

    {
      title: "Ngày gửi",

      dataIndex: "ngay_gui",

      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
  ];

  // ================= FILTER =================

  const filterData =
    filter === "ALL" ? data : data.filter((x) => x.trang_thai === filter);

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <Card
        style={{
          borderRadius: 16,
          marginBottom: 20,
          background: "linear-gradient(135deg,#1677ff,#69c0ff)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                color: "#fff",
                margin: 0,
              }}
            >
              📄 Yêu cầu của tôi
            </h2>

            <p
              style={{
                marginTop: 8,
                opacity: 0.9,
              }}
            >
              Theo dõi tình trạng xử lý hồ sơ
            </p>
          </div>

          <FileTextOutlined
            style={{
              fontSize: 50,
              color: "#fff",
            }}
          />
        </div>
      </Card>

      {/* FILTER */}

      <Card
        style={{
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <Space wrap>
          <Select
            value={filter}
            onChange={setFilter}
            style={{
              width: 220,
            }}
            options={[
              {
                value: "ALL",
                label: "📌 Tất cả",
              },

              {
                value: "CHO_XU_LY",
                label: "🟠 Chờ xử lý",
              },

              {
                value: "DANG_XU_LY",
                label: "🔵 Đang xử lý",
              },

              {
                value: "HOAN_THANH",
                label: "🟢 Hoàn thành",
              },

              {
                value: "TU_CHOI",
                label: "🔴 Từ chối",
              },
            ]}
          />
        </Space>
      </Card>

      {/* TABLE */}

      <Card
        style={{
          borderRadius: 16,
        }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filterData}
          loading={loading}
          pagination={{
            pageSize: 8,
          }}
          scroll={{
            x: 700,
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelected(record);

              setOpen(true);
            },

            style: {
              cursor: "pointer",
            },
          })}
        />
      </Card>

      {/* DETAIL MODAL */}

      <Modal
        open={open}
        width={950}
        footer={null}
        centered
        onCancel={() => {
          setOpen(false);

          setSelected(null);
        }}
        title={
          selected && (
            <Space>
              <FileTextOutlined />
              Yêu cầu #{selected.id}
              {renderStatus(selected.trang_thai)}
            </Space>
          )
        }
      >
        {selected && (
          <>
            {/* STATUS */}

            {/* INFO */}

            <Card
              title="📋 Thông tin yêu cầu"
              style={{
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <b>Mã yêu cầu</b>

                  <p>#{selected.id}</p>
                </div>

                <div>
                  <b>Loại yêu cầu</b>

                  <p>{selected.loai_yeu_cau}</p>
                </div>

                <div>
                  <b>Ngày gửi</b>

                  <p>{dayjs(selected.ngay_gui).format("DD/MM/YYYY HH:mm")}</p>
                </div>

                <div>
                  <b>Trạng thái</b>

                  <p>{renderStatus(selected.trang_thai)}</p>
                </div>
              </div>

              <Divider />

              <b>Nội dung</b>

              <div
                style={{
                  marginTop: 10,

                  padding: 15,

                  background: "#f5f5f5",

                  borderRadius: 10,
                }}
              >
                {selected.noi_dung || "Không có nội dung"}
              </div>
            </Card>

            <Divider />

            {/* FILE GỬI */}

            <Card
              title="📂 Hồ sơ đã gửi"
              style={{
                borderRadius: 12,
              }}
            >
              {selected.tep_dinh_kem && selected.tep_dinh_kem.length ? (
                selected.tep_dinh_kem.map((file, index) => {
                  const name = file.duong_dan.split("/").pop();

                  const url = API_FILE + "api/file/download/" + name;

                  return (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <Space>
                        <FileTextOutlined />

                        <Link href={url} target="_blank">
                          {file.ten_file}
                        </Link>

                        <Button
                          type="primary"
                          ghost
                          size="small"
                          href={url}
                          icon={<DownloadOutlined />}
                        >
                          Tải
                        </Button>
                      </Space>
                    </Card>
                  );
                })
              ) : (
                <Empty description="Không có hồ sơ" />
              )}
            </Card>

            <Divider />

            {/* RESULT */}

            <Card
              title="📄 Văn bản kết quả"
              style={{
                borderRadius: 12,
              }}
            >
              {selected.van_ban_phan_hoi && selected.van_ban_phan_hoi.length ? (
                selected.van_ban_phan_hoi.map((file, index) => {
                  const url = API_FILE + file.duong_dan;

                  return (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <Space>
                        <FileTextOutlined />

                        <Link href={url} target="_blank">
                          {file.ten_file}
                        </Link>

                        <Button
                          size="small"
                          type="primary"
                          icon={<DownloadOutlined />}
                          href={url}
                        >
                          Tải văn bản
                        </Button>
                      </Space>
                    </Card>
                  );
                })
              ) : (
                <Empty description="Chưa có kết quả" />
              )}
            </Card>

            <Divider />

            {/* NOTE */}

            <Card
              title="📝 Phản hồi xử lý"
              style={{
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  padding: 15,

                  background: "#fafafa",

                  borderRadius: 10,
                }}
              >
                {selected.ghi_chu_xu_ly || (
                  <Text type="secondary">Chưa có phản hồi</Text>
                )}
              </div>
            </Card>

            {/* CANCEL */}

            {selected.trang_thai === "CHO_XU_LY" && (
              <div
                style={{
                  marginTop: 20,
                  textAlign: "right",
                }}
              >
                <Popconfirm
                  title="Hủy yêu cầu?"
                  description="Bạn chắc chắn muốn hủy hồ sơ này?"
                  okText="Hủy"
                  cancelText="Không"
                  onConfirm={handleCancel}
                >
                  <Button danger size="large">
                    Hủy yêu cầu
                  </Button>
                </Popconfirm>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
