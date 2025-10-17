"use client";
import { useCreateColumn } from "@/libs/react-query/mutation/column.mutation";
import { Modal, Input, Space, Typography } from "antd";
import { useState } from "react";
interface IProps {
    isColumnModalOpen: boolean;
    setIsColumnModalOpen: (v: boolean) => void;
    boardId: string;
}
const ColumnModal = ({
    isColumnModalOpen,
    setIsColumnModalOpen,
    boardId,
}: IProps) => {
    const { Text } = Typography;
    const { mutate } = useCreateColumn();
    const [newColumn, setNewColumn] = useState<string>("");
    const handleColumnOk = () => {
        if (boardId) {
            mutate(
                {
                    board_id: boardId,
                    title: newColumn,
                },
                {
                    onSuccess: () => {
                        setNewColumn("");
                        setIsColumnModalOpen(false);
                    },
                }
            );
        }
    };

    const handleColumnCancel = () => {
        setNewColumn("");
        setIsColumnModalOpen(false);
    };
    return (
        <Modal
            title="Add another column"
            open={isColumnModalOpen}
            onOk={handleColumnOk}
            onCancel={handleColumnCancel}
            okText="Add"
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Text>Card Title</Text>
                <Input
                    placeholder="Enter column name..."
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                />
            </Space>
        </Modal>
    );
};
export default ColumnModal;
