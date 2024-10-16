import { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { followerService, likeService, postService } from "../Services";
import { Button, Comments, Recemendations } from "../Components";
import { formatDateRelative } from "../Utils";
import { useUserContext, usePopupContext } from "../Context";
import { icons } from "../Assets/icons";
import parse from "html-react-parser";

export default function PostPage() {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const { setShowPopup, setPopupText, setLoginPopupText, setShowLoginPopup } = usePopupContext();
    const [post, setPost] = useState({});
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        (async function getPost() {
            try {
                setLoading(true);
                const res = await postService.getPost(postId);
                if (res && !res.message) {
                    setPost(res);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [postId, user]);

    async function toggleLike() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText("Like");
                return;
            }
            const res = await likeService.togglePostLike(postId, true);
            if (res && res.message === "POST_LIKE_TOGGLED_SUCCESSFULLY") {
                setPost((prev) => {
                    if (prev.isLiked) {
                        return {
                            ...prev,
                            totalLikes: prev.totalLikes - 1,
                            isLiked: false,
                        };
                    } else {
                        return {
                            ...prev,
                            totalLikes: prev.totalLikes + 1,
                            totalDislikes: prev.isDisliked
                                ? prev.totalDislikes - 1
                                : prev.totalDislikes,
                            isLiked: true,
                            isDisliked: false,
                        };
                    }
                });
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function toggleDislike() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText("Dislike");
                return;
            }
            const res = await likeService.togglePostLike(postId, false);
            if (res && res.message === "POST_LIKE_TOGGLED_SUCCESSFULLY") {
                setPost((prev) => {
                    if (prev.isDisliked) {
                        return {
                            ...prev,
                            totalDislikes: prev.totalDislikes - 1,
                            isDisliked: false,
                        };
                    } else {
                        return {
                            ...prev,
                            totalDislikes: prev.totalDislikes + 1,
                            totalLikes: prev.isLiked ? prev.totalLikes - 1 : prev.totalLikes,
                            isDisliked: true,
                            isLiked: false,
                        };
                    }
                });
                setShowPopup(true);
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function toggleFollow() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText("Follow");
                return;
            }
            const res = await followerService.toggleFollow(post.post_ownerId);
            if (
                res &&
                (res.message === "FOLLOWED_SUCCESSFULLY" ||
                    res.message === "UNFOLLOWED_SUCCESSFULLY")
            ) {
                setPost((prev) => ({
                    ...prev,
                    isFollowed: !prev.isFollowed,
                }));
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function toggleSave() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText("Save");
                return;
            }
            const res = await postService.toggleSavePost(postId);
            if (
                res &&
                (res.message === "POST_UNSAVED_SUCCESSFULLY" ||
                    res.message === "POST_SAVED_SUCCESSFULLY")
            ) {
                setPopupText(
                    `${
                        res.message === "POST_SAVED_SUCCESSFULLY"
                            ? "Post Saved Successfully 🤗"
                            : "Post Unsaved Successfully 🙂"
                    }`
                );
                setShowPopup(true);
                setPost((prev) => ({ ...prev, isSaved: !prev.isSaved }));
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    return loading ? (
        <div>loading...</div>
    ) : Object.keys(post).length === 0 ? (
        <div>Post Not Found !!</div>
    ) : (
        <div className="w-full h-full flex items-start justify-start gap-6 overflow-scroll">
            <div className="w-[70%] h-full">
                <div>
                    <div className="h-[500px]">
                        <img
                            src={post.post_image}
                            alt="post image"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="text-3xl font-medium w-full">{post.post_title}</div>

                    <div>
                        <div>{post.category_name}</div>
                        <div>
                            {post.totalViews} views &bull; {formatDateRelative(post.post_createdAt)}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-3">
                                <NavLink
                                    to={`/channel/${post.userName}`}
                                    className="size-[50px] rounded-full overflow-hidden"
                                >
                                    <img
                                        src={post.avatar}
                                        alt="post owner avatar"
                                        className="object-cover size-full"
                                    />
                                </NavLink>

                                <div>
                                    <div>
                                        {post.firstName} {post.lastName}
                                    </div>
                                    <div>@{post.userName}</div>
                                </div>
                            </div>

                            <div>
                                {user?.user_name === post.userName ? (
                                    <Button
                                        btnText="Edit"
                                        onClick={() => navigate(`/update/${post.post_id}`)}
                                    />
                                ) : (
                                    <Button
                                        btnText={post.isFollowed ? "Unfollow" : "Follow"}
                                        onClick={toggleFollow}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-start justify-start gap-4">
                            {/* like/dislike btn */}
                            <div className="flex items-center justify-start gap-4">
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    post.isLiked
                                                        ? "fill-white stroke-black"
                                                        : "fill-none stroke-white"
                                                } size-[20px]`}
                                            >
                                                {icons.like}
                                            </div>
                                            <div>{post.totalLikes}</div>
                                        </div>
                                    }
                                    onClick={toggleLike}
                                />
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    post.isDisliked
                                                        ? "fill-white stroke-black"
                                                        : "fill-none stroke-white"
                                                } size-[20px]`}
                                            >
                                                {icons.dislike}
                                            </div>
                                            <div>{post.totalDislikes}</div>
                                        </div>
                                    }
                                    onClick={toggleDislike}
                                />
                            </div>

                            {/* saved btn */}
                            <div>
                                <Button
                                    btnText={
                                        <div
                                            className={`${
                                                post.isSaved
                                                    ? "fill-white stroke-black"
                                                    : "fill-none stroke-white"
                                            } size-[20px]`}
                                        >
                                            {icons.save}
                                        </div>
                                    }
                                    onClick={toggleSave}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-md">{parse(post.post_content)}</div>
                </div>

                {/* comments */}
                <div>
                    <Comments postId={postId} />
                </div>
            </div>

            {/* recemendations */}
            <div className="w-[30%] bg-red-400">
                <Recemendations category={post.category_name} />
            </div>
        </div>
    );
}
