import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelContext, useUserContext } from "../../Context";
import { postService } from "../../Services";
import { icons } from "../../Assets/icons";
import { PostCardView, Button } from "..";
import { paginate } from "../../Utils";
import { LIMIT } from "../../Constants/constants";

export default function ChannelPosts() {
    const { channel } = useChannelContext();
    const { user } = useUserContext();
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // fetching posts
    useEffect(() => {
        (async function getChannelPosts() {
            try {
                setLoading(true);
                const res = await postService.getPosts(channel.user_id, LIMIT, page);
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [channel.userName, page]);

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, loading, setPage);

    // displaying posts
    const postElements = posts?.map((post, index) => (
        <PostCardView
            key={post.post_id}
            post={post}
            reference={index + 1 === posts.length ? paginateRef : null}
        />
    ));

    return (
        <div>
            <div className="w-full">
                {user.user_name === channel.user_name && (
                    <div className="w-full flex items-center justify-center mb-4">
                        <Button
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px] fill-white">{icons.plus}</div>
                                    <div>New Post</div>
                                </div>
                            }
                            onClick={() => navigate("/add")}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">loading first batch...</div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#8871ee] dark:text-[#b5b4b4]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait . . .</span>
                    </div>
                )
            ) : postElements.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                    {postElements}
                </div>
            ) : (
                <div>No posts found !!</div>
            )}
        </div>
    );
}
