"use client";
import { Modal, Input, Button } from "antd";
import "@/components/styles/card.modal.scss";
import { useEffect, useRef, useState } from "react";
import { useCommentsByCardId } from "@/libs/react-query/query/comment.query";
import { BeatLoader } from "react-spinners";
import {
    useDeleteCard,
    useUpdateCardDescription,
} from "@/libs/react-query/mutation/card.mutation";
import {
    useCreateComment,
    useDeleteComment,
    useUpdateComment,
} from "@/libs/react-query/mutation/comment.mutation";
import { useUser } from "@clerk/nextjs";

interface IProps {
    isCardModalOpen: boolean;
    setIsCardModalOpen: (v: boolean) => void;
    card: ICard;
}

const CardModal = ({ isCardModalOpen, setIsCardModalOpen, card }: IProps) => {
    const { user } = useUser();
    const { data: comments } = useCommentsByCardId(card.id);
    const { mutate: addDescription } = useUpdateCardDescription();
    const { mutateAsync: deleteCard } = useDeleteCard();
    const { mutate: addComment } = useCreateComment();
    const { mutateAsync: editComment } = useUpdateComment();
    const { mutateAsync: removeComment } = useDeleteComment();
    const [isEditingDescription, setIsEditingDescription] =
        useState<boolean>(false);
    const [editingDescription, setEditingDescription] = useState<string>("");
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
        null
    );
    const [editingCommentText, setEditingCommentText] = useState("");

    const [commentUsers, setCommentUsers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [localCard, setLocalCard] = useState(card);
    const descriptionInputRef = useRef<any>(null);

    const handleCancel = () => {
        setIsCardModalOpen(false);
        setIsEditingDescription(false);
        setIsEditingComment(false);
        setCommentText("");
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
    const handleDeleteCard = async (cardId: string) => {
        if (!cardId) return;

        Modal.confirm({
            title: "Delete this card?",
            content: "This action cannot be undone.",
            okText: "Delete",
            okButtonProps: { danger: true },
            cancelText: "Cancel",
            onOk: async () => {
                await deleteCard(cardId);
                setIsCardModalOpen(false);
            },
        });
    };
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        if (user) {
            await addComment(
                {
                    card_id: card.id,
                    content: commentText,
                    user_id: user.id,
                },
                {
                    onSuccess: () => {
                        setCommentText("");
                        setIsEditingComment(false);
                    },
                }
            );
        }
    };
    const handleSaveEditComment = async () => {
        if (!editingCommentId || !editingCommentText.trim()) return;

        await editComment({
            id: editingCommentId,
            content: editingCommentText,
        });

        setEditingCommentId(null);
        setEditingCommentText("");
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
                        <Button
                            type="default"
                            onClick={() => handleDeleteCard(card.id)}
                        >
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
                        autoSize={{ minRows: 1 }}
                        onFocus={() => setIsEditingComment(true)}
                        onChange={(e) => setCommentText(e.target.value)}
                    />

                    {isEditingComment && (
                        <div className="edit-actions">
                            <Button
                                type="primary"
                                disabled={!commentText.trim()}
                                onClick={handleAddComment}
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

                                                {editingCommentId === c.id ? (
                                                    <Input.TextArea
                                                        value={
                                                            editingCommentText
                                                        }
                                                        autoSize={{
                                                            minRows: 1,
                                                        }}
                                                        onChange={(e) =>
                                                            setEditingCommentText(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="comment-content">
                                                        {c.content}
                                                    </div>
                                                )}

                                                <div className="comment-actions">
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => {
                                                            setEditingCommentId(
                                                                c.id
                                                            );
                                                            setEditingCommentText(
                                                                c.content
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <span>•</span>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: "Delete comment?",
                                                                okText: "Delete",
                                                                okButtonProps: {
                                                                    danger: true,
                                                                },
                                                                cancelText:
                                                                    "Cancel",
                                                                onOk: async () => {
                                                                    await removeComment(
                                                                        c.id
                                                                    );
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                    {editingCommentId ===
                                                        c.id && (
                                                        <div className="edit-actions">
                                                            <Button
                                                                type="primary"
                                                                onClick={
                                                                    handleSaveEditComment
                                                                }
                                                            >
                                                                Save
                                                            </Button>

                                                            <Button
                                                                onClick={() => {
                                                                    setEditingCommentId(
                                                                        null
                                                                    );
                                                                    setEditingCommentText(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    )}
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
