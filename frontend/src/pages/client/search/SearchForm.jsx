import { Card, Input, Button, Row, Col, Radio } from "antd";
import {
    SearchOutlined,
    UserOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";

const SearchForm = ({
    searchMode,
    setSearchMode,
    cccd,
    setCccd,
    address,
    setAddress,
    handleSearch,
    loading
}) => {
    return (
        <>
            <Card style={{ marginBottom: 20 }}>
                <Radio.Group
                    value={searchMode}
                    onChange={(e) => setSearchMode(e.target.value)}
                >
                    <Radio.Button value="cccd">
                        Tìm theo CCCD
                    </Radio.Button>

                    {/* <Radio.Button value="address">
                        Tìm theo địa chỉ
                    </Radio.Button> */}

                    <Radio.Button value="map">
                        Tìm trên bản đồ
                    </Radio.Button>
                </Radio.Group>
            </Card>

            {(searchMode === "cccd" || searchMode === "address") && (
                <Card>
                    <Row gutter={12}>
                        <Col flex="auto">
                            {searchMode === "cccd" ? (
                                <Input
                                    size="large"
                                    value={cccd}
                                    onChange={(e) => setCccd(e.target.value)}
                                    onPressEnter={handleSearch}
                                    placeholder="Nhập CCCD"
                                    prefix={<UserOutlined />}
                                />
                            ) : (
                                <Input
                                    size="large"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onPressEnter={handleSearch}
                                    placeholder="Nhập địa chỉ..."
                                    prefix={<EnvironmentOutlined />}
                                />
                            )}
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                loading={loading}
                            >
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}
        </>
    );
};

export default SearchForm;