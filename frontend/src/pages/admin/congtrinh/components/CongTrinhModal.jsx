import {
    Modal,
    Form,
    Select,
    Button,
    Input,
    InputNumber
} from "antd";

import { useEffect, useState } from "react";

import CongTrinhMap from "./CongTrinhMap";
import ChuSoHuuTable from "./ChuSoHuuTable";
import ChuyenSoHuu from "./ChuyenSoHuu";

import {
    updateCongTrinh,
    deleteCongTrinh
} from "../../../../services/congTrinh.service";

import {
    chuyenNhuongCongTrinh
} from "../../../../services/soHuuCongTrinh.service";

import {
    createBienDong
} from "../../../../services/bienDong.service";

import {
    getChuSoHuuByCCCD
} from "../../../../services/chuSoHuu.service";

export default function CongTrinhModal({
    open,
    selected,
    onClose,
    thuaDatList,
    onReload
}) {

    const [form] = Form.useForm();

    const [openTransfer, setOpenTransfer] =
        useState(false);

    const [selectedOwner, setSelectedOwner] =
        useState(null);

    const [chuSoHuuMoi, setChuSoHuuMoi] =
        useState(null);

    // ================= LOAD =================

    useEffect(() => {

        if (selected) {

            form.setFieldsValue(selected);

        } else {

            form.resetFields();
        }

    }, [selected, form]);

    // ================= UPDATE =================

    const handleSubmit = async (values) => {

        if (!selected) return;

        await updateCongTrinh(selected.id, {

            ...values,

            geom: selected.geom
        });

        onClose();

        onReload();
    };

    // ================= DELETE =================

    const handleDelete = (id) => {

        Modal.confirm({

            title:
                "Xác nhận xóa công trình",

            content:
                "Bạn chắc chắn muốn xóa công trình này?",

            okText: "Xóa",

            cancelText: "Hủy",

            okType: "danger",

            centered: true,

            onOk: async () => {

                try {

                    await deleteCongTrinh(id);

                    onClose();

                    onReload();

                } catch (err) {

                    console.log(err);
                }
            }
        });
    };

    // ================= OPEN TRANSFER =================

    const handleOpenTransfer = (owner) => {

        setSelectedOwner(owner);

        setOpenTransfer(true);
    };

    // ================= SEARCH CCCD =================

    const handleSearchCCCD = async (cccd) => {

        try {

            const res =
                await getChuSoHuuByCCCD(cccd);

            const owner = res?.data || null;

            setChuSoHuuMoi(owner);

            return owner;

        } catch (err) {

            console.log(err);

            setChuSoHuuMoi(null);

            return null;
        }
    };

    // ================= TRANSFER =================

    const handleTransfer = async (payload) => {

        try {

            // ================= CHUYỂN SỞ HỮU =================

            await chuyenNhuongCongTrinh({

                ...payload,

                cong_trinh_id: selected?.id
            });

            // ================= BIẾN ĐỘNG =================

            await createBienDong({

                cong_trinh_id: selected?.id,

                loai_bien_dong:
                    payload.loai_giao_dich,

                chu_so_huu_cu_id:
                    payload.chu_so_huu_cu_id,

                chu_so_huu_moi_id:
                    payload.chu_so_huu_moi_id,

                ty_le_chuyen:
                    payload.ty_le_chuyen,

                gia_tri_giao_dich:
                    payload.gia_tri_giao_dich,

                noi_dung:
                    payload.ghi_chu,

                ngay_bien_dong:
                    payload.ngay_bien_dong,

                nguoi_tao:
                    payload.nguoi_tao
            });

            setOpenTransfer(false);

            setSelectedOwner(null);

            setChuSoHuuMoi(null);

            onReload();

        } catch (err) {

            console.log(err);

            Modal.error({

                title: "Lỗi chuyển nhượng",

                content:
                    err?.response?.data?.message ||
                    err.message
            });
        }
    };

    return (

        <>
            <Modal
                title="Thông tin công trình"
                open={open}
                onCancel={onClose}
                onOk={() => form.submit()}
                width={950}
                destroyOnHidden
                forceRender
            >

                {/* ================= FORM ================= */}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr 1fr",
                        gap: 12
                    }}
                >

                    <Form.Item
                        name="ten_cong_trinh"
                        label="Tên công trình"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="loai_cong_trinh"
                        label="Loại công trình"
                    >
                        <Select
                            options={[
                                {
                                    value: "Nhà ở",
                                    label: "Nhà ở"
                                },
                                {
                                    value: "Cao ốc",
                                    label: "Cao ốc"
                                },
                                {
                                    value: "Nhà xưởng",
                                    label: "Nhà xưởng"
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dia_chi"
                        label="Địa chỉ"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="dien_tich_xay_dung"
                        label="Diện tích xây dựng"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dien_tich_san"
                        label="Diện tích sàn"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="so_tang"
                        label="Số tầng"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="ket_cau"
                        label="Kết cấu"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="cap_hang"
                        label="Cấp hạng"
                    >
                        <Select options={[
                            { value: "Cấp 1", label: "Cấp 1" },
                            { value: "Cấp 2", label: "Cấp 2" },
                            { value: "Cấp 3", label: "Cấp 3" },
                            { value: "Cấp 4", label: "Cấp 4" },
                            { value: "Cấp Đặc biệt", label: "Cấp Đặc biệt" }
                        ]} />
                    </Form.Item>

                    <Form.Item
                        name="nam_xay_dung"
                        label="Năm xây dựng"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="trang_thai"
                        label="Trạng thái"
                    >
                        <Select
                            options={[
                                {
                                    value: "Đang sử dụng",
                                    label: "Đang sử dụng"
                                },
                                {
                                    value: "Chưa hoàn thành",
                                    label: "Chưa hoàn thành"
                                },
                                {
                                    value: "thu hồi",
                                    label: "Thu hồi"
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="hinh_thuc_so_huu"
                        label="Hình thức sở hữu"
                    >
                        <Select options={[
                            { value: "Sử hữu Chung", label: "Sử hữu Chung" },
                            { value: "Sử hữu Riêng", label: "Sử hữu Riêng" },
                        ]} />
                    </Form.Item>

                    <Form.Item
                        name="thoi_han_so_huu"
                        label="Thời hạn sở hữu"
                    >
                        <Input />
                    </Form.Item>

                </Form>

                {/* ================= CHỦ SỞ HỮU ================= */}

                <div style={{ marginTop: 20 }}>

                    <ChuSoHuuTable
                        detail={selected || {}}
                        onOpenTransfer={
                            handleOpenTransfer
                        }
                    />

                </div>

                {/* ================= MAP ================= */}

                <div style={{ marginTop: 20 }}>

                    <CongTrinhMap
                        selected={selected}
                    />

                </div>

                {/* ================= DELETE ================= */}

                {
                    selected && (

                        <Button
                            danger
                            style={{
                                marginTop: 15
                            }}
                            onClick={() =>
                                handleDelete(selected.id)
                            }
                        >
                            Xóa công trình
                        </Button>
                    )
                }

            </Modal>

            {/* ================= CHUYỂN NHƯỢNG ================= */}

            <ChuyenSoHuu
                open={openTransfer}
                selectedOwner={selectedOwner}
                chuSoHuuMoi={chuSoHuuMoi}
                onSearchCCCD={handleSearchCCCD}
                onClose={() => {

                    setOpenTransfer(false);

                    setSelectedOwner(null);

                    setChuSoHuuMoi(null);
                }}
                onSubmit={handleTransfer}
            />
        </>
    );
}