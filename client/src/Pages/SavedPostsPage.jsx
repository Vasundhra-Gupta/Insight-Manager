import { useEffect, useState } from "react";
import { Button, SavedPostView } from "../Components";
import { postService } from "../Services";
import { useNavigate } from "react-router-dom";
import { icons } from "../Assets/icons";
import { paginate } from "../Utils";
import { LIMIT } from "../Constants/constants";

export default function SavedPostsPage() {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, loading, setPage);

    useEffect(() => {
        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getSavedPosts(LIMIT, page);
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
    }, [page]);

    const postElements = posts?.map((post, index) => (
        <SavedPostView
            key={post.post_id}
            post={post}
            reference={index + 1 === posts.length ? paginateRef : null}
        >
            {/* children */}
            <div>
                <Button
                    btnText={<div className="size-[20px]">{icons.delete}</div>}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFromLiked();
                    }}
                />
            </div>
        </SavedPostView>
    ));

    return (
        <div>
            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">loading first batch...</div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#8871ee] dark:text-[#b5b4b4]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait...</span>
                    </div>
                )
            ) : postElements.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-x-4 gap-y-7">
                    {postElements}
                </div>
            ) : (
                <div>No saved posts !!</div>
            )}
        </div>
    );
}
