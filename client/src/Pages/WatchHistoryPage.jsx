import { icons } from '../Assets/icons';
import { Button, PostListView } from '../Components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../Services';
import { paginate, formatDateRelative } from '../Utils';
import { LIMIT } from '../Constants/constants';
import { useUserContext } from '../Context';

export default function WatchHistoryPage() {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, loading, setPage);

    useEffect(() => {
        (async function getPosts() {
            try {
                setLoading(true);
                const res = await userService.getWatchHistory(LIMIT, page);
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, [page, user]);

    async function clearHistory() {
        try {
            const res = await userService.clearWatchHistory();
            if (res && res.message === 'WATCH_HISTORY_CLEARED_SUCCESSFULLY') {
                setPosts([]);
                setPostsInfo({});
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    const postElements = posts?.map((post, index) => (
        <PostListView
            key={post.post_id}
            post={post}
            reference={index + 1 === posts.length ? paginateRef : null}
        >
            {/* children */}
            <div className="text-sm absolute bottom-2 right-2">
                watched {formatDateRelative(post.watchedAt)}
            </div>
        </PostListView>
    ));

    return !user ? (
        <div>Login to see history</div>
    ) : (
        <div className="w-full h-full overflow-scroll">
            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#8871ee] dark:text-[#b5b4b4]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait . . .</span>
                    </div>
                )
            ) : postElements.length > 0 ? (
                <div>
                    <div>
                        <Button
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px]">
                                        {icons.delete}
                                    </div>
                                    <div>Clear Watch History</div>
                                </div>
                            }
                            onClick={clearHistory}
                        />
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-x-4 gap-y-7">
                        {postElements}
                    </div>
                </div>
            ) : (
                <div>No read posts !!</div>
            )}
        </div>
    );
}
