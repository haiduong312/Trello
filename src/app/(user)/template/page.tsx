import React from "react";
import { Col, Row } from "antd";
import TemplateMenu from "@/components/template/template.menu";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Template | Trello",
    description: "Trello's Template Page",
};
const TemplatePage = async () => {
    return (
        <Row>
            <Col span={4} style={{ padding: "40px 0 0 32px" }}>
                <TemplateMenu />
            </Col>
        </Row>
    );
};
export default TemplatePage;
