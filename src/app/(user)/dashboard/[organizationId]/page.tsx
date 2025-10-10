import React from "react";
import { Col, Row } from "antd";
import BoardMenu from "@/components/board/board.menu";
import MostPopularTemplate from "@/components/board/mostPopular";
import WorkSpaces from "@/components/board/workspaces";
import { currentUser } from "@clerk/nextjs/server";
import { userService } from "@/libs/services";
const BoardPage = async () => {
    const user = await currentUser();
    if (user) {
        const full_name = user.lastName + user.firstName!;
        const email = user.emailAddresses[0].emailAddress;

        userService.syncUser(user.id, full_name, user.imageUrl, email);
    }

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
