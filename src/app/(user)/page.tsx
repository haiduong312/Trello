import React from "react";
import { Col, Row } from "antd";
import MenuSLider from "@/components/main/menu.main";
import MostPopularTemplate from "@/components/main/mostPopular";
import RecentView from "@/components/main/recentView";
import WorkSpaces from "@/components/main/workspaces";

const HomePage = () => {
  return (
    <Row>
      <Col span={4} style={{ padding: "40px 0 0 32px" }}>
        <MenuSLider />
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
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 914,
          }}
        >
          <div>
            <MostPopularTemplate />
          </div>
          <div>
            <RecentView />
          </div>
          <div>
            <WorkSpaces />
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default HomePage;
