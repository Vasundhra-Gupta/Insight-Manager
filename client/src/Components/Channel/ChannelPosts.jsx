import { useEffect, useState } from "react";
import useChannelContext from "../../Context/ChannelContext";
import { postService } from "../../Services/postService";
import { useNavigate } from "react-router-dom";
import { icons } from "../../assets/icons";
import PostCardView from "../Post/PostCardView";

export default function ChannelPosts() {
    const { channel } = useChannelContext();
    const [posts, setPosts] = useState([]);
    const [postInfo, setPostInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [postsFound, setPostsFound] = useState(true);
    const navigate = useNavigate();
    const limit = 5;

    useEffect(() => {
        (async function getChannelPosts() {
            try {
                setLoading(true);
                const res = await postService.getPosts(channel.userId, limit, page);
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostInfo(res.postsInfo);
                } else {
                    setPostsFound(false);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [channel, page]);

    const postElements = posts?.map((post, index) => (
        <PostCardView key={post.post_id} post={post} />
    ));

    if (!postsFound) return <div>No posts Found.</div>;
    return (
        <div>
            {postElements.length && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                    {postElements}
                </div>
            )}

            {loading &&
                (page === 1 ? (
                    <div className="w-full text-center">loading first batch...</div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#8871ee] dark:text-[#b5b4b4]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait . . .</span>
                    </div>
                ))}
        </div>
    );
}
