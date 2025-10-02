"use client";

import {
  AppstoreOutlined,
  BellOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Layout, Popover } from "antd";
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
            <AppstoreOutlined
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
            className="trello-input"
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
            gap: 10,
          }}
        >
          <Popover
            placement="bottom"
            content={<div>Share your thoughts on Trello</div>}
          >
            <NotificationOutlined style={{ fontSize: 20 }} className="noti" />
          </Popover>

          <Popover placement="bottom" content={<div>Notifications</div>}>
            <BellOutlined style={{ fontSize: 20 }} className="bell" />
          </Popover>

          <Popover placement="bottom" content={<div>Information</div>}>
            <QuestionCircleOutlined style={{ fontSize: 20 }} className="ques" />
          </Popover>

          <Popover placement="bottomRight" content={<div>Account</div>}>
            <div className="ava">
              <Avatar icon={<UserOutlined />} size={25} />
            </div>
          </Popover>
        </div>
      </Layout.Header>
    </Layout>
  );
}
