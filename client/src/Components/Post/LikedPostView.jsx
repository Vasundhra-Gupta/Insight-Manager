import { Link, useNavigate } from "react-router-dom";
import { formatDateRelative } from "../../Utils/formatDate";
import { Button } from "..";
import { icons } from "../../Assets/icons";
import { likeService } from "../../Services/likeService";
import { useState } from "react";

export default function LikedPostView({ post, reference }) {
    const {
        post_id,
        post_image,
        totalViews,
        post_title,
        post_content,
        post_updatedAt,
        category_name,
        firstName,
        lastName,
        userName,
        avatar,
    } = post;

    const [isRemoved, setIsRemoved] = useState(false);
    const navigate = useNavigate();

    async function removeFromLiked() {
        try {
            const res = await likeService.togglePostLike(post_id, true);
            if (res && res.message === "POST_LIKE_TOGGLED_SUCCESSFULLY") {
                setIsRemoved(true);
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function addToLiked() {
        try {
            const res = await likeService.togglePostLike(post_id, true);
            if (res && res.message === "POST_LIKE_TOGGLED_SUCCESSFULLY") {
                setIsRemoved(false);
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/post/${post_id}`)}
            className="relative cursor-pointer flex flex-col sm:flex-row items-start justify-start h-[300px] w-full gap-x-4 pr-4 border-[0.01rem]"
        >
            <div className="h-full w-full">
                <img alt="post image" src={post_image} className="h-full" />
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-y-4">
                <div className="text-xl font-medium text-white">{post_title}</div>

                <Link
                    to={`/channel/${userName}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-start justify-start gap-3"
                >
                    <div className="pt-1">
                        <img
                            alt="post owner avatar"
                            src={avatar}
                            className="size-[50px] rounded-full"
                        />
                    </div>

                    <div>
                        <div className="text-xl font-medium text-white">
                            {firstName} {lastName}
                        </div>

                        <div className="text-[#dedddd]">@{userName}</div>
                    </div>
                </Link>

                <div className="text-sm text-[#b0b0b0]">
                    {totalViews} views &bull; {formatDateRelative(post_updatedAt)}
                </div>

                <div className="text-ellipsis line-clamp-2 text-sm text-[#e1e1e1]">
                    {post_content}
                </div>
            </div>

            <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation}>
                {isRemoved ? (
                    <Button
                        btnText={<div className="size-[20px]">{icons.undo}</div>}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToLiked();
                        }}
                    />
                ) : (
                    <Button
                        btnText={<div className="size-[20px]">{icons.delete}</div>}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFromLiked();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
