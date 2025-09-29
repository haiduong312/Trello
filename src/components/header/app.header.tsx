"use client";

import {
  BarsOutlined,
  BellOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Layout } from "antd";
import "@/components/styles/header.style.scss";
import Image from "next/image";
export default function AppHeader() {
  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          background: "white",
          height: 48,
        }}
      >
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            marginRight: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="options-icon">
            <BarsOutlined
              style={{
                color: "rgba(80,82,88,1)",
                fontSize: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            />
          </div>
          <div className="app-icon">
            <Image
              src="/assets/trello-icon.svg"
              alt="trello"
              width={25}
              height={25}
            />
            <div className="title">Trello</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            style={{ width: "780px" }}
          />
          <Button style={{ marginLeft: 8 }} type="primary">
            Search
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NotificationOutlined style={{ fontSize: 20 }} />
          <BellOutlined style={{ fontSize: 20, paddingLeft: 15 }} />
          <QuestionCircleOutlined
            style={{ fontSize: 20, paddingLeft: 15, paddingRight: 15 }}
          />
          <Avatar icon={<UserOutlined />} size={25} />
        </div>
      </Layout.Header>
    </Layout>
  );
}
