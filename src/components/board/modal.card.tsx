"use client";
import { Modal, Input, Button } from "antd";
import "@/components/styles/card.modal.scss";
import { useEffect, useState } from "react";

interface IProps {
    isCardModalOpen: boolean;
    setIsCardModalOpen: (v: boolean) => void;
    card: ICard;
}

const CardModal = ({ isCardModalOpen, setIsCardModalOpen, card }: IProps) => {
    console.log(card);
    const [isEditingDescription, setIsEditingDescription] =
        useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const handleCancel = () => setIsCardModalOpen(false);
    useEffect(() => {
        setDescription(card.description ?? "");
    }, [card]);
    return (
        <Modal
            open={isCardModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={900}
            centered
            className="card-modal"
        >
            <div className="card-modal-content">
                {/* LEFT */}
                <div className="left-section">
                    <h2 className="card-title">{card.title}</h2>
                    <div className="actions">
                        <Button type="default">Add an comment</Button>
                        <Button type="default">Edit description</Button>
                    </div>

                    <div className="description">
                        <h3>Description</h3>
                        {description ? (
                            description
                        ) : (
                            <Input.TextArea
                                value={description}
                                placeholder="Add a more detailed description..."
                                autoSize={{ minRows: 6 }}
                                onFocus={() => setIsEditingDescription(true)}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        )}

                        {isEditingDescription && (
                            <div className="edit-actions">
                                <Button
                                    type="primary"
                                    disabled={!description.trim()}
                                    onClick={() =>
                                        console.log("Save", description)
                                    }
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() =>
                                        setIsEditingDescription(false)
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="right-section">
                    <h3>Comments</h3>

                    <Input.TextArea
                        value={commentText}
                        placeholder="Write a comment..."
                        autoSize={{ minRows: 3 }}
                        onFocus={() => setIsEditingComment(true)}
                        onChange={(e) => setCommentText(e.target.value)}
                    />

                    {isEditingComment && (
                        <div className="edit-actions">
                            <Button
                                type="primary"
                                disabled={!commentText.trim()}
                                onClick={() => {
                                    setCommentText(""); // clear
                                    setIsEditingComment(false); // tắt edit
                                }}
                            >
                                Save
                            </Button>

                            <Button
                                onClick={() => {
                                    setCommentText("");
                                    setIsEditingComment(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}

                    {/* Render comment list */}
                    <div className="comment-list">
                        {card.comment &&
                            card.comment.map((c, i) => (
                                <div key={i} className="comment-item">
                                    {c.content}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CardModal;
