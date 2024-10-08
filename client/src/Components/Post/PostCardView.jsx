import { Link, useNavigate } from "react-router-dom";
import formatDate from "../../Utils/formatDate";

export default function PostCardView({ post }) {
    const {
        post_id,
        post_image,
        post_views,
        post_title,
        post_createdAt,
        owner_id,
        owner_firstName,
        owner_lastName,
        owner_avatar,
    } = post;

    const navigate = useNavigate();
    const formattedCreatedAt = formatDate(post_createdAt);

    return (
        <div
            onClick={() => navigate(`/post/${post_id}`)}
            className="flex flex-col items-center justify-center gap-4"
        >
            <div>
                <img alt="post image" src={post_image} />
            </div>

            <div className="flex items-center justify-start gap-y-4">
                <div>
                    <Link to={`/channel/${owner_id}`}>
                        <img alt="post owner avatar" src={owner_avatar} />
                    </Link>
                </div>

                <div className="flex flex-col items-start justify-center gap-y-1">
                    <div className="text-xl font-medium text-white">{post_title}</div>
                    <div className="text-lg font-medium text-white">
                        {owner_firstName} {owner_lastName}
                    </div>
                    <div className="text-sm text-[#888787]">
                        {post_views} views &bull; {formattedCreatedAt}
                    </div>
                </div>
            </div>
        </div>
    );
}
