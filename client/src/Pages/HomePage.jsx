import { useCallback, useEffect, useState } from "react";
import { PostListView } from "../Components";
import { postService } from "../Services/postService";
import { useNavigate } from "react-router-dom";
import { icons } from "../Assets/icons";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [postsFound, setPostsFound] = useState(true);
    const navigate = useNavigate();
    const limit = 5;

    // pagination
    let observer;
    const paginateRef = useCallback(
        function (lastPostNode) {
            if (loading) return;
            if (observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                const lastPost = entries[0];
                if (lastPost.isIntersecting && postsInfo.hasNextPage) {
                    setPage((prev) => prev + 1);
                }
            });
            if (lastPostNode) observer.observe(lastPostNode);
        },
        [postsInfo.hasNextPage]
    );

    // fetching the posts
    useEffect(() => {
        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(page, limit);
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                } else if (res?.message && page === 1) {
                    setPostsFound(false);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    // displaying posts
    const postElements = posts?.map((post, index) =>
        index + 1 === posts.length ? (
            <PostListView key={post.post_id} post={post} reference={paginateRef} />
        ) : (
            <PostListView key={post.post_id} post={post} reference={null} />
        )
    );

    if (!postsFound) {
        return <div>no posts found!</div>;
    }
    return (
        <div>
            {postElements.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-x-4 gap-y-7">
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
