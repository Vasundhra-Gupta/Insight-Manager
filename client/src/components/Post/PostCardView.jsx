import { Image } from "..";
import { Link, useNavigate } from "react-router-dom";
import formatDate from "../../Utils/formatDate";

export default function PostCardView({ post }) {
    const {
        post_id,
        post_image,
        post_views,
        post_title,
        post_ownerId,
        post_createdAt,
        post_owner_firstname,
        post_owner_lastname,
        post_owner_avatar,
    } = post;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div>
                <Link to={`/post/${post_id}`}>
                    <Image altText="post image" src={post_image} />
                </Link>
            </div>

            <div className="flex items-center justify-start gap-y-4">
                <div>
                    <Link to={`/channel/${post_ownerId}`}>
                        <Image altText="post owner avatar" src={post_owner_avatar} />
                    </Link>
                </div>

                <div className="flex flex-col items-start justify-center gap-y-1">
                    <div className="text-xl font-medium text-white">{post_title}</div>
                    <div className="text-lg font-medium text-white">
                        {post_owner_firstname} {post_owner_lastname}
                    </div>
                    <div className="text-sm text-[#888787]">
                        {post_views} views &bull; {formatDate(post_createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}
