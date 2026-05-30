import { Card, Input, Button, Row, Col, Radio } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const SearchForm = ({
    searchMode,
    setSearchMode,
    cccd,
    setCccd,
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
                    <Radio.Button value="cccd">Tìm theo CCCD</Radio.Button>
                    <Radio.Button value="map">Tìm trên bản đồ</Radio.Button>
                </Radio.Group>
            </Card>

            {searchMode === "cccd" && (
                <Card>
                    <Row gutter={12}>
                        <Col flex="auto">
                            <Input
                                size="large"
                                value={cccd}
                                onChange={(e) => setCccd(e.target.value)}
                                onPressEnter={handleSearch}
                                placeholder="Nhập CCCD"
                                prefix={<UserOutlined />}
                            />
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