"use client";
import { useCreateColumn } from "@/libs/react-query/mutation/column.mutation";
import { Modal, Input, Space, Typography, Form, FormProps, Button } from "antd";
import { useState } from "react";
interface IProps {
  isColumnModalOpen: boolean;
  setIsColumnModalOpen: (v: boolean) => void;
  boardId: string;
}
type FieldType = {
  title: string;
};
const ColumnModal = ({
  isColumnModalOpen,
  setIsColumnModalOpen,
  boardId,
}: IProps) => {
  const [form] = Form.useForm();
  const { mutate } = useCreateColumn();
  const handleColumnOk: FormProps<FieldType>["onFinish"] = (values) => {
    if (boardId) {
      mutate(
        {
          board_id: boardId,
          title: values.title,
        },
        {
          onSuccess: () => {
            setIsColumnModalOpen(false);
          },
        }
      );
    }
  };

  const handleColumnCancel = () => {
    form.resetFields();
    setIsColumnModalOpen(false);
  };
  return (
    <Modal
      title="Add another column"
      open={isColumnModalOpen}
      onCancel={handleColumnCancel}
      onOk={() => form.submit()}
      okText="Add"
    >
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleColumnOk}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please input your column name!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ColumnModal;
