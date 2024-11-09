import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePopupContext, useUserContext } from '../../Context';
import { commentService, likeService } from '../../Services';
import { formatDateRelative } from '../../Utils';
import { icons } from '../../Assets/icons';
import { Button } from '..';

export default function Comment({ comment, setComments }) {
    const {
        comment_id,
        comment_content,
        comment_createdAt,
        isLiked,
        user_firstName,
        user_lastName,
        user_name,
        user_avatar,
        likes,
        dislikes,
    } = comment;
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { setShowPopup, setPopupText, setLoginPopupText, setShowLoginPopup } =
        usePopupContext();
    const [newContent, setNewContent] = useState(comment_content);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleLike() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText('Follow');
                return;
            }
            const res = await likeService.toggleCommentLike(comment_id, true);
            if (res && res.message === 'COMMENT_LIKE_TOGGLED_SUCCESSFULLY') {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            if (item.isLiked === 1) {
                                return {
                                    ...item,
                                    isLiked: -1, // no interaction
                                    likes: item.likes - 1,
                                };
                            } else {
                                return {
                                    ...item,
                                    isLiked: 1,
                                    likes: item.likes + 1,
                                    dislikes:
                                        item.isLiked === 0
                                            ? item.dislikes - 1
                                            : item.dislikes, // -1 (no interaction hi rha hoga)
                                };
                            }
                        } else return item;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function handleDislike() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText('Follow');
                return;
            }
            const res = await likeService.toggleCommentLike(comment_id, false);
            if (res && res.message === 'COMMENT_LIKE_TOGGLED_SUCCESSFULLY') {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            if (item.isLiked === 0) {
                                return {
                                    ...item,
                                    isLiked: -1,
                                    dislikes: item.dislikes - 1,
                                };
                            } else {
                                return {
                                    ...item,
                                    isLiked: 0,
                                    dislikes: item.dislikes + 1,
                                    likes:
                                        item.isLiked === 1
                                            ? item.likes - 1
                                            : item.likes,
                                };
                            }
                        } else return item;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function editComment(e) {
        try {
            e.preventDefault();
            setIsUpdating(true);
            const res = await commentService.updateComment(
                comment_id,
                newContent
            );
            if (res && !res.message) {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            return {
                                ...item,
                                comment_content: newContent,
                            };
                        } else return item;
                    })
                );
                setIsEditing(false);
                setShowPopup(true);
                setPopupText('Comment Edited Successfully 🙂');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setIsUpdating(false);
        }
    }

    async function deleteComment() {
        try {
            const res = await commentService.deleteComment(comment_id);
            if (res && res.message === 'COMMENT_DELETED_SUCCESSFULLY') {
                setComments((prev) =>
                    prev.filter((item) => item.comment_id !== comment_id)
                );
                setShowPopup(true);
                setPopupText('Comment Deleted Successfully 🙂');
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <div className="w-full">
            <div className="relative flex items-start justify-start gap-2">
                <div className="rounded-full size-[40px] overflow-hidden">
                    <NavLink to={`/channel/${user_name}`}>
                        <img
                            src={user_avatar}
                            alt="comment owner avatar"
                            className="object-cover size-full"
                        />
                    </NavLink>
                </div>

                <div className="flex flex-col items-start justify-start gap-1">
                    <div>
                        <div className="flex items-center justify-start gap-2">
                            <div>
                                <NavLink to={`/channel/${user_name}`}>
                                    {user_firstName} {user_lastName}
                                </NavLink>
                            </div>

                            <div className="text-sm">&bull;</div>

                            <div className="text-sm">
                                {formatDateRelative(comment_createdAt)}
                            </div>
                        </div>

                        <div className="text-sm">@{user_name}</div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={editComment}>
                            <input
                                type="text"
                                placeholder="Add a comment"
                                name="comment"
                                value={newContent}
                                autoFocus
                                onChange={(e) => setNewContent(e.target.value)}
                                className="bg-transparent border-[0.01rem] rounded-lg p-2 indent-2 text-white"
                            />

                            {/* reset btn */}
                            <Button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewContent(comment_content);
                                }}
                                btnText="Cancel"
                            />

                            {/* submit btn */}
                            <Button
                                type="submit"
                                btnText={isUpdating ? 'Updating...' : 'Update'}
                            />
                        </form>
                    ) : (
                        <div className="text-ellipsis line-clamp-2">
                            {comment_content}
                        </div>
                    )}

                    <div className="flex items-center justify-start gap-2 mt-2">
                        <Button
                            onClick={handleLike}
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className={`${
                                            isLiked === 1
                                                ? 'fill-white stroke-black'
                                                : 'fill-none stroke-white'
                                        } size-[20px]`}
                                    >
                                        {icons.like}
                                    </div>
                                    <div>{likes}</div>
                                </div>
                            }
                        />

                        <Button
                            onClick={handleDislike}
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className={`${
                                            isLiked === 0
                                                ? 'fill-white stroke-black'
                                                : 'fill-none stroke-white'
                                        } size-[20px]`}
                                    >
                                        {icons.dislike}
                                    </div>
                                    <div>{dislikes}</div>
                                </div>
                            }
                        />
                    </div>
                </div>

                {user_name === user?.user_name && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 absolute top-2 right-2">
                        <Button
                            onClick={() => setIsEditing(true)}
                            btnText={
                                <div className="size-[20px]">{icons.edit}</div>
                            }
                        />

                        <Button
                            onClick={deleteComment}
                            btnText={
                                <div className="size-[20px]">
                                    {icons.delete}
                                </div>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
