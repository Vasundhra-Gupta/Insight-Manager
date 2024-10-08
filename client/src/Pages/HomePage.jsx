import { useCallback, useEffect, useRef, useState } from "react";
import { PostListView } from "../Components";
import { postService } from "../Services/postService";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [postInfo, setPostInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    let postsFound = true;
    const navigate = useNavigate();

    const observer = useRef();
    const callBackRef = useCallback(() => {}, []);

    useEffect(() => {
        (async function getPosts() {
            setLoading(true);
            try {
                const res = await postService.getRandomPosts();
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostInfo(res.postsInfo);
                } else if (res?.message && page === 1) {
                    setPosts([]);
                    setPosts({});
                    postsFound = false;
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);

    const postElements = posts?.map((post, index) =>
        index + 1 === posts.length ? (
            <PostListView key={post.post_id} post={post} reference={callBackRef} />
        ) : (
            <PostListView key={post.post_id} post={post} reference={null} />
        )
    );

    return loading ? (
        <div>loading ...</div>
    ) : postsFound ? (
        <div className="p-4 flex flex-col items-start justify-start gap-4 h-full w-full">{postElements}</div>
    ) : (
        <div>No Posts Found !!</div>
    );
}
