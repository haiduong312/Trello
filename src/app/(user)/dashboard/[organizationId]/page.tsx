import React from "react";
import { Col, Row } from "antd";
import BoardMenu from "@/components/board/board.menu";
import MostPopularTemplate from "@/components/board/mostPopular";
import WorkSpaces from "@/components/board/workspaces";
import { useMostPopularBoard } from "@/libs/react-query/query/board.query";
import { boardService } from "@/libs/services";
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
