import React from "react";
import { Col, Row } from "antd";
import DashboardMenu from "@/components/dashboard/dashboard.menu";
import MostPopularTemplate from "@/components/dashboard/mostPopular";
import WorkSpaces from "@/components/dashboard/workspaces";

const DashboardPage = async () => {
    return (
        <Row>
            <Col span={4} style={{ padding: "40px 0 0 32px" }}>
                <DashboardMenu />
            </Col>
            <Col
                span={20}
                style={{
                    padding: "48px 56px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflowY: "auto",
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
export default DashboardPage;
