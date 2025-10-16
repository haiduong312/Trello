import React from "react";
import { Col, Row } from "antd";
import BoardMenu from "@/components/dashboard/board.menu";
import MostPopularTemplate from "@/components/dashboard/mostPopular";
import WorkSpaces from "@/components/dashboard/workspaces";

const BoardPage = async () => {
    return (
        <Row>
            <Col span={4} style={{ padding: "40px 0 0 32px" }}>
                <BoardMenu />
            </Col>
            <Col
                span={20}
                style={{
                    padding: "48px 56px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div>
                    <div style={{ marginBottom: 48 }}>
                        <MostPopularTemplate />
                    </div>
                    <div>
                        <WorkSpaces />
                    </div>
                </div>
            </Col>
        </Row>
    );
};
export default BoardPage;
