"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnById } from "@/libs/react-query/query/column.query";
import { usePathname } from "next/navigation";
import {
  Card,
  Typography,
  Button,
  Modal,
  Input,
  Space,
  Popconfirm,
} from "antd";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import BoardHeader from "../header/board.header";
import ColumnModal from "./modal.column";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import type { PopconfirmProps } from "antd";
import { useDeleteColumn } from "@/libs/react-query/mutation/column.mutation";

const { Title, Text } = Typography;

const BoardTemplate = () => {
  const currentPathName = usePathname();
  const pathName = currentPathName.split("/board/")[1];
  const { data: column } = useColumnById(pathName);
  console.log("column", column);
  const { data: board, isLoading } = useBoardId(pathName);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
  const { mutate: deleteColumn } = useDeleteColumn();
  const card = true;
  if (isLoading || !board) {
    return <div>Loading...</div>;
  }

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };
  return (
    <div
      style={{
        backgroundImage: `url("${board.backgroundUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div>
        <BoardHeader name={board.title} />
      </div>
      <div className="column-container">
        {column?.map((col, idx) => (
          <Card
            key={col.id}
            className="column-content"
            styles={{
              body: {
                padding: 15,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={5}>{col.title}</Title>
              <div style={{ paddingBottom: 11 }}>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => deleteColumn(col.id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseOutlined />
                </Popconfirm>
              </div>
            </div>
            {/* Hiển thị danh sách task */}
            {card ? (
              <div style={{ flex: 1, overflowY: "auto" }}>
                <Card
                  key={idx}
                  size="small"
                  styles={{
                    body: {
                      padding: 8,
                      background: "rgb(0 0 0 / 4%)",
                      borderRadius: 8,
                    },
                  }}
                  className="card"
                >
                  <Text>{col.title}</Text>
                </Card>
              </div>
            ) : (
              <></>
            )}

            {/* Nút thêm task */}
            <Button
              color="default"
              variant="filled"
              block
              style={{ marginTop: "8px" }}
              // onClick={() => handleAddTask(col.id)}
            >
              + Add a Card
            </Button>
          </Card>
        ))}
        <div>
          <Button
            color="default"
            type="text"
            variant="outlined"
            block
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(2px)",
              fontSize: 16,
              color: "black",
            }}
            onClick={() => setIsColumnModalOpen(true)}
          >
            + Add another column
          </Button>
        </div>
      </div>
      {/* Modal thêm column */}
      <div>
        <ColumnModal
          isColumnModalOpen={isColumnModalOpen}
          setIsColumnModalOpen={setIsColumnModalOpen}
          boardId={pathName}
        />
      </div>
      {/* Modal thêm task */}
      {/* <Modal
                title="Add New Task"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Text>Card Title</Text>
                    <Input
                        placeholder="Enter task name..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </Space>
            </Modal> */}
    </div>
  );
};

export default BoardTemplate;
