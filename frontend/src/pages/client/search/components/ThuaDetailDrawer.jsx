import { Drawer, Descriptions } from "antd";

export default function ThuaDetailDrawer({ open, onClose, data }) {

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={500}
            title="Chi tiết thửa đất"
        >
            {data && (
                <Descriptions column={1}>
                    <Descriptions.Item label="Số thửa">
                        {data.so_thua}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tờ bản đồ">
                        {data.so_to_ban_do}
                    </Descriptions.Item>

                    <Descriptions.Item label="Chủ sở hữu">
                        {data.chu_so_huu}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
}