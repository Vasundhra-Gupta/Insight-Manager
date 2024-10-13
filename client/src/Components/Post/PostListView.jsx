import { Link, useNavigate } from "react-router-dom";
import { formatDateRelative } from "../../Utils/formatDate";

export default function PostListView({ post, reference }) {
    const {
        post_id,
        post_image,
        post_views,
        post_title,
        post_content,
        post_createdAt,
        firstName,
        lastName,
        userName,
        avatar,
    } = post;

    const navigate = useNavigate();
    const formattedCreatedAt = formatDateRelative(post_createdAt);

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/post/${post_id}`)}
            className="cursor-pointer flex flex-col sm:flex-row items-start justify-start h-[300px] w-full gap-x-4 pr-4 border-[0.01rem]"
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
                    {post_views} views &bull; {formattedCreatedAt}
                </div>
            </div>
        </div>
    );
}
