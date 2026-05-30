import { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import dayjs from "dayjs";

import {
    getChuSoHuu,
    getChuSoHuuByCCCD,
    createChuSoHuu,
    updateChuSoHuu,
    deleteChuSoHuu,
    getTaiSanByChuSoHuuId
} from "../../../services/chuSoHuu.service";

import ChuSoHuuTable from "./components/ChuSoHuuTable";
import ChuSoHuuForm from "./components/ChuSoHuuForm";
import TaiSanModal from "./components/TaiSanModal";

export default function ChuSoHuu() {

    const [data, setData] = useState([]);

    const [openForm, setOpenForm] = useState(false);

    const [openTaiSan, setOpenTaiSan] =
        useState(false);

    const [mode, setMode] = useState("add");

    const [selected, setSelected] = useState(null);

    const [taiSan, setTaiSan] = useState([]);

    const [loadingTaiSan, setLoadingTaiSan] =
        useState(false);

    // ================= LOAD =================
    const fetchData = async () => {

        try {

            const res = await getChuSoHuu();

            setData(res?.data || []);

        } catch (err) {

            console.log(err);

            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= SEARCH =================
    const handleSearch = async (value) => {

        try {

            if (!value) {

                fetchData();

                return;
            }

            const res =
                await getChuSoHuuByCCCD(value);

            setData(
                res?.data
                    ? [res.data]
                    : []
            );

        } catch (err) {

            console.log(err);

            setData([]);
        }
    };

    // ================= ADD =================
    const handleAdd = () => {

        setMode("add");

        setSelected(null);

        setOpenForm(true);
    };

    // ================= EDIT =================
    const handleEdit = (record) => {

        setMode("edit");

        setSelected({
            ...record,
            ngay_sinh:
                record.ngay_sinh
                    ? dayjs(record.ngay_sinh)
                    : null
        });

        setOpenForm(true);
    };

    // ================= SAVE =================
    const handleSubmit = async (values) => {

        try {

            const payload = {

                ...values,

                ngay_sinh:
                    values.ngay_sinh
                        ? values.ngay_sinh.format("YYYY-MM-DD")
                        : null
            };

            if (mode === "edit") {

                await updateChuSoHuu(
                    selected.id,
                    payload
                );

            } else {

                await createChuSoHuu(payload);
            }

            setOpenForm(false);

            fetchData();

        } catch (err) {

            console.log(err);
        }
    };

    // ================= DELETE =================
    const handleDelete = (id) => {

        Modal.confirm({

            title:
                "Xác nhận xóa chủ sở hữu",

            content:
                "Bạn chắc chắn muốn xóa?",

            okText: "Xóa",

            cancelText: "Hủy",

            okType: "danger",

            centered: true,

            onOk: async () => {

                try {

                    await deleteChuSoHuu(id);

                    setOpenForm(false);

                    setSelected(null);

                    fetchData();

                } catch (err) {

                    console.log(err);
                }
            }
        });
    };

    // ================= TÀI SẢN =================
    const handleCheckTaiSan = async () => {

        if (!selected?.id) return;

        try {

            setLoadingTaiSan(true);

            const res =
                await getTaiSanByChuSoHuuId(
                    selected.id
                );

            setTaiSan(res?.data || []);

            setOpenForm(false);

            setOpenTaiSan(true);

        } catch (err) {

            console.log(err);

            setTaiSan([]);

        } finally {

            setLoadingTaiSan(false);
        }
    };

    return (

        <div style={{ padding: 24 }}>

            <h2>
                👤 Quản lý chủ sở hữu
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 12
                }}
            >

                <Button
                    type="primary"
                    onClick={handleAdd}
                >
                    + Thêm chủ sở hữu
                </Button>

                <Input.Search
                    placeholder="Tìm theo CCCD..."
                    allowClear
                    enterButton
                    style={{ width: 300 }}
                    onSearch={handleSearch}
                />

            </div>

            <ChuSoHuuTable
                data={data}
                onEdit={handleEdit}
            />

            <ChuSoHuuForm
                open={openForm}
                mode={mode}
                selected={selected}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onCheckTaiSan={handleCheckTaiSan}
            />

            <TaiSanModal
                open={openTaiSan}
                selected={selected}
                taiSan={taiSan}
                loading={loadingTaiSan}
                onClose={() => {

                    setOpenTaiSan(false);

                    setTaiSan([]);
                }}
            />

        </div>
    );
}