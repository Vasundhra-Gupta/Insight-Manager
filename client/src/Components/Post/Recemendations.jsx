import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../Services";
import { paginate } from "../../Utils";
import { icons } from "../../Assets/icons";
import { LIMIT } from "../../Constants/constants";
import { PostListView } from "..";

export default function Recemendations({ category }) {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(page, LIMIT, category);
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
    }, [category, page]);

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, loading, setPage);

    const postElements = posts?.map((post, index) => (
        <PostListView
            key={post.post_id}
            post={post}
            reference={index + 1 === posts.length ? paginateRef : null}
        />
    ));

    return (
        <div className="w-full h-full">
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
            ) : (
                postElements.length > 0 && (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7 w-full">
                        {postElements}
                    </div>
                )
            )}
        </div>
    );
}
