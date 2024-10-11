import { Link, useNavigate } from "react-router-dom";
import { formatDateRelative } from "../../Utils/formatDate";

export default function PostCardView({ post, reference, isHomePage = false }) {
    const {
        post_id,
        post_image,
        post_views,
        post_title,
        post_createdAt,
        userName,
        firstName,
        lastName,
        avatar,
    } = post;

    const navigate = useNavigate();
    const formattedCreatedAt = formatDateRelative(post_createdAt);

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/post/${post_id}`)}
            className="flex flex-col items-start justify-center gap-4"
        >
            <div>
                <img alt="post image" src={post_image} />
            </div>

            {isHomePage ? (
                <div className="flex items-center justify-start gap-y-4">
                    <div>
                        <Link
                            to={`/channel/${userName}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img alt="post owner avatar" src={avatar} />
                        </Link>
                    </div>

                    <div className="flex flex-col items-start justify-center gap-y-1">
                        <div className="text-xl font-medium text-white">{post_title}</div>

                        <div className="text-lg font-medium text-white">
                            {firstName} {lastName}
                        </div>

                        <div className="text-sm text-[#888787]">
                            {post_views} views &bull; {formattedCreatedAt}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-start justify-center gap-y-1">
                    <div className="text-xl font-medium text-white">{post_title}</div>

                    <div className="text-sm text-[#888787]">
                        {post_views} views &bull; {formattedCreatedAt}
                    </div>
                </div>
            )}
        </div>
    );
}
