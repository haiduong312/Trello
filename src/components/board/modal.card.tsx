"use client";
import { Modal, Input, Button } from "antd";
import "@/components/styles/card.modal.scss";
import { useEffect, useRef, useState } from "react";
import { useCommentsByCardId } from "@/libs/react-query/query/comment.query";
import { BeatLoader } from "react-spinners";
import { useUpdateCardDescription } from "@/libs/react-query/mutation/card.mutation";

interface IProps {
    isCardModalOpen: boolean;
    setIsCardModalOpen: (v: boolean) => void;
    card: ICard;
}

const CardModal = ({ isCardModalOpen, setIsCardModalOpen, card }: IProps) => {
    const { data: comments } = useCommentsByCardId(card.id);
    const { mutate: addDescription } = useUpdateCardDescription();
    const [isEditingDescription, setIsEditingDescription] =
        useState<boolean>(false);
    const [editingDescription, setEditingDescription] = useState<string>("");
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentUsers, setCommentUsers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [localCard, setLocalCard] = useState(card);
    const descriptionInputRef = useRef<any>(null);

    const handleCancel = () => {
        setIsCardModalOpen(false);
        setIsEditingDescription(false);
        setIsEditingComment(false);
    };
    useEffect(() => {
        setLocalCard(card);
    }, [card]);
    useEffect(() => {
        setEditingDescription(card.description || "");
    }, [card]);
    useEffect(() => {
        if (isEditingDescription) {
            descriptionInputRef.current?.focus({ cursor: "end" });
        }
    }, [isEditingDescription]);
    useEffect(() => {
        if (comments) {
            const fetchUsers = async () => {
                setIsLoading(true);
                const results = await Promise.all(
                    comments.map((c) =>
                        fetch(`/api/users/${c.user_id}`).then((res) =>
                            res.json()
                        )
                    )
                );

                const mapped: Record<string, any> = {};
                results.forEach((u, i) => (mapped[comments[i].user_id] = u));
                setCommentUsers(mapped);
                setIsLoading(false);
            };
            fetchUsers();
        }
    }, [comments]);
    const handleAddDescription = async (
        cardId: string,
        description: string
    ) => {
        if (cardId && description) {
            await addDescription(
                {
                    cardId: cardId,
                    description: description,
                },
                {
                    onSuccess: () => {
                        setLocalCard((prev) => ({
                            ...prev,
                            description: editingDescription,
                        }));
                        setEditingDescription("");
                        setIsEditingDescription(false);
                    },
                }
            );
        }
    };
    const handleEditClick = () => {
        setEditingDescription(localCard.description || editingDescription);
        setIsEditingDescription(true);
    };
    return (
        <Modal
            open={isCardModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={1000}
            centered
            className="card-modal"
        >
            <div className="card-modal-content">
                {/* LEFT */}
                <div className="left-section">
                    <h2 className="card-title">{localCard.title}</h2>
                    <div className="actions">
                        <Button type="default" onClick={handleEditClick}>
                            Edit description
                        </Button>
                        <Button type="default" onClick={() => {}}>
                            Delete card
                        </Button>
                    </div>

                    <div className="description">
                        <h3>Description</h3>

                        {!isEditingDescription ? (
                            <div onClick={handleEditClick}>
                                {localCard.description || (
                                    <Input.TextArea
                                        value={editingDescription}
                                        placeholder="Add a more detailed description..."
                                        onFocus={() =>
                                            setIsEditingDescription(true)
                                        }
                                        onChange={(e) => {
                                            setEditingDescription(
                                                e.target.value
                                            );
                                        }}
                                        autoSize={{ minRows: 6 }}
                                    />
                                )}
                            </div>
                        ) : (
                            <Input.TextArea
                                ref={descriptionInputRef}
                                value={editingDescription}
                                autoSize={{ minRows: 6 }}
                                onChange={(e) =>
                                    setEditingDescription(e.target.value)
                                }
                            />
                        )}

                        {isEditingDescription && (
                            <div className="edit-actions">
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        handleAddDescription(
                                            card.id,
                                            editingDescription
                                        )
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
                    {isLoading ? (
                        <div style={{ marginTop: 20 }}>
                            <BeatLoader size={10} color="#1677FF" />
                        </div>
                    ) : (
                        <div className="comment-list">
                            {comments &&
                                comments.map((c, i) => {
                                    return (
                                        <div
                                            className="comment-item"
                                            key={c.id}
                                        >
                                            <div>
                                                <img
                                                    src={
                                                        commentUsers[c.user_id]
                                                            ?.imageUrl
                                                    }
                                                    alt=""
                                                    className="avatar"
                                                />
                                            </div>

                                            <div className="comment-body">
                                                <div className="comment-header">
                                                    <span className="username">
                                                        {
                                                            commentUsers[
                                                                c.user_id
                                                            ]?.firstName
                                                        }{" "}
                                                        {
                                                            commentUsers[
                                                                c.user_id
                                                            ]?.lastName
                                                        }
                                                    </span>
                                                </div>

                                                <div className="comment-content">
                                                    {c.content}
                                                </div>

                                                <div className="comment-actions">
                                                    <button className="action-btn">
                                                        Edit
                                                    </button>
                                                    <span>•</span>
                                                    <button className="action-btn delete">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CardModal;
