"use client";
import { useCreateCards } from "@/libs/react-query/mutation/card.mutation";
import { Modal, Input, Space, Typography, Form, Button } from "antd";
import { useState } from "react";
interface IProps {
  isCardModalOpen: boolean;
  setIsCardModalOpen: (v: boolean) => void;
  columnId: string | null;
}
type FieldType = {
  title?: string;
  description?: string;
};
const CardModal = ({
  isCardModalOpen,
  setIsCardModalOpen,
  columnId,
}: IProps) => {
  const { Text } = Typography;
  const { mutate } = useCreateCards();
  const [newColumn, setNewColumn] = useState<string>("");
  const handleColumnOk = () => {
    if (columnId) {
      mutate(
        {
          column_id: columnId,
          title: newColumn,
          description: newColumn,
        },
        {
          onSuccess: () => {
            setNewColumn("");
            setIsCardModalOpen(false);
          },
        }
      );
    }
  };

  const handleColumnCancel = () => {
    setNewColumn("");
    setIsCardModalOpen(false);
  };
  return (
    <Modal
      title="Add a card"
      open={isCardModalOpen}
      onOk={handleColumnOk}
      onCancel={handleColumnCancel}
      okText="Add"
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleColumnOk}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="title"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="description"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CardModal;
