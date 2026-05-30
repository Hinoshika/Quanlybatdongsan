import { Modal, Row, Col, Descriptions, Card, Divider, Tag, Empty } from "antd";

const DetailModal = ({ open, selected, setOpen }) => {
    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={1200}
            title={selected?.isConstruction ? "Thông tin Công Trình" : "Thông tin Thửa Đất"}
        >
            {selected && (
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={14}>
                        <Descriptions
                            bordered
                            column={1}
                            title="Thông tin chính"
                            labelStyle={{ width: "35%" }}
                        >
                            {selected.isConstruction ? (
                                <>
                                    <Descriptions.Item label="Tên công trình">{selected.ten_cong_trinh}</Descriptions.Item>
                                    <Descriptions.Item label="Loại công trình">{selected.loai_cong_trinh}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">{selected.dia_chi}</Descriptions.Item>
                                    <Descriptions.Item label="Số tầng">{selected.so_tang}</Descriptions.Item>
                                    <Descriptions.Item label="Diện tích xây dựng">{selected.dien_tich_xay_dung} m²</Descriptions.Item>
                                    <Descriptions.Item label="Năm xây dựng">{selected.nam_xay_dung}</Descriptions.Item>
                                    <Descriptions.Item label="Kết cấu">{selected.ket_cau}</Descriptions.Item>
                                    <Descriptions.Item label="Hình thức sở hữu">{selected.hinh_thuc_so_huu}</Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">{selected.trang_thai}</Descriptions.Item>
                                </>
                            ) : (
                                <>
                                    <Descriptions.Item label="Số thửa">{selected.so_thua}</Descriptions.Item>
                                    <Descriptions.Item label="Tờ bản đồ">{selected.so_to_ban_do}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">{selected.dia_chi}</Descriptions.Item>
                                    <Descriptions.Item label="Tỉnh">{selected.tinh}</Descriptions.Item>
                                    <Descriptions.Item label="Diện tích">{selected.dien_tich} m²</Descriptions.Item>
                                    <Descriptions.Item label="Loại đất">{selected.loai_dat}</Descriptions.Item>
                                    <Descriptions.Item label="Mục đích sử dụng">{selected.muc_dich_su_dung}</Descriptions.Item>
                                    <Descriptions.Item label="Hình thức sử dụng">{selected.hinh_thuc_su_dung}</Descriptions.Item>
                                    <Descriptions.Item label="Thời hạn sử dụng">{selected.thoi_han_su_dung}</Descriptions.Item>
                                    <Descriptions.Item label="Nguồn gốc sử dụng">{selected.nguon_goc_su_dung}</Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">{selected.trang_thai}</Descriptions.Item>
                                </>
                            )}
                        </Descriptions>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Card title="Thông tin chủ sở hữu">
                            {selected.chu_so_huu?.length > 0 ? (
                                selected.chu_so_huu.map((owner, index) => (
                                    <div key={index}>
                                        <Descriptions bordered column={1} size="small">
                                            <Descriptions.Item label="Họ tên">{owner.ho_ten}</Descriptions.Item>
                                            <Descriptions.Item label="Loại">
                                                {/* <Tag color="blue"> */}
                                                {owner.loai}
                                                {/* </Tag> */}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="CCCD">{owner.so_cccd}</Descriptions.Item>
                                            <Descriptions.Item label="Địa chỉ">{owner.dia_chi}</Descriptions.Item>
                                        </Descriptions>
                                        {index !== selected.chu_so_huu.length - 1 && <Divider />}
                                    </div>
                                ))
                            ) : (
                                <Empty description="Không có chủ sở hữu" />
                            )}
                        </Card>
                    </Col>
                </Row>
            )
            }
        </Modal >
    );
};

export default DetailModal;