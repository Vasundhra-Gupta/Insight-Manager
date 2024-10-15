import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { commentService, likeService } from "../../Services";
import { formatDateRelative } from "../../Utils";
import { icons } from "../../Assets/icons";
import { Button } from "..";

export default function Comment({ commentId }) {
    const [comment, setComment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async function getComment() {
            try {
                const res = await commentService.getComment(commentId);
                if (res && !res.message) {
                    setComment(res);
                }
            } catch (err) {
                navigate("/server-error");
            }
        })();
    }, [commentId]);

    async function handleLike() {
        try {
            const res = await likeService.toggleCommentLike(comment.comment_id, true);
            if (res && res.message === "COMMENT_LIKE_TOGGLED_SUCCESSFULLY") {
                setComment((prev) => {
                    if (prev.isLiked) {
                        return {
                            ...prev,
                            isLiked: false,
                            likes: prev.likes - 1,
                        };
                    } else {
                        return {
                            ...prev,
                            isLiked: true,
                            isDisliked: false,
                            likes: prev.likes + 1,
                            dislikes: prev.isDisliked ? prev.dislikes - 1 : prev.dislikes,
                        };
                    }
                });
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function handleDislike() {
        try {
            const res = await likeService.toggleCommentLike(comment.comment_id, false);
            if (res && res.message === "COMMENT_LIKE_TOGGLED_SUCCESSFULLY") {
                setComment((prev) => {
                    if (prev.isDisliked) {
                        return {
                            ...prev,
                            isDisliked: false,
                            dislikes: prev.dislikes - 1,
                        };
                    } else {
                        return {
                            ...prev,
                            isDisliked: true,
                            isLiked: false,
                            dislikes: prev.dislikes + 1,
                            likes: prev.isLiked ? prev.likes - 1 : prev.likes,
                        };
                    }
                });
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    if (comment) {
        return (
            <div className="w-full h-full">
                <div className="flex items-start justify-start gap-2">
                    <NavLink
                        to={`/channel/${comment.user_name}`}
                        className="rounded-full size-[40px] overflow-hidden"
                    >
                        <img
                            src={comment.user_avatar}
                            alt="comment owner avatar"
                            className="object-cover size-full"
                        />
                    </NavLink>

                    <div className="flex flex-col items-start justify-start gap-1">
                        <div>
                            <div className="flex items-center justify-start gap-2">
                                <NavLink to={`/channel/${comment.user_name}`}>
                                    {comment.user_firstName} {comment.user_lastName}
                                </NavLink>
                                <div className="text-sm">&bull;</div>
                                <div className="text-sm">
                                    {formatDateRelative(comment.comment_createdAt)}
                                </div>
                            </div>

                            <div className="text-sm">@{comment.user_name}</div>
                        </div>

                        <div className="text-ellipsis line-clamp-2">{comment.comment_content}</div>

                        <div className="flex items-center justify-start gap-2">
                            <Button
                                onClick={handleLike}
                                btnText={
                                    <div className="flex items-center justify-center gap-2">
                                        <div
                                            className={`${
                                                comment.isLiked
                                                    ? "fill-white stroke-black"
                                                    : "fill-none stroke-white"
                                            } size-[20px]`}
                                        >
                                            {icons.like}
                                        </div>
                                        <div className="">{comment.likes}</div>
                                    </div>
                                }
                            />

                            <Button
                                onClick={handleDislike}
                                btnText={
                                    <div className="flex items-center justify-center gap-2">
                                        <div
                                            className={`${
                                                comment.isDisliked
                                                    ? "fill-white stroke-black"
                                                    : "fill-none stroke-white"
                                            } size-[20px]`}
                                        >
                                            {icons.dislike}
                                        </div>
                                        <div className="">{comment.dislikes}</div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
