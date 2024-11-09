import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPostRow, Button } from '../Components';
import { userService, postService } from '../Services';
import { useUserContext } from '../Context';
import { paginate } from '../Utils';
import { LIMIT } from '../Constants/constants';
import { icons } from '../Assets/icons';

export default function AdminPage() {
    const { user } = useUserContext();
    const [statsData, setStatsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async function getChannelProfile() {
            try {
                setLoading(true);
                const res = await userService.getChannelProfile(user.user_name);
                if (res && !res.message) {
                    setStatsData(res);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async function getChannelPosts() {
            try {
                setPostsLoading(true);
                const res = await postService.getPosts(
                    user.user_id,
                    LIMIT,
                    page
                );
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setPostsLoading(false);
            }
        })();
    }, [page, user]);

    const stats = [
        {
            name: 'Total Likes',
            value: statsData.totalLikes,
        },
        {
            name: 'Total Views',
            value: statsData.totalChannelViews,
        },
        {
            name: 'Total Posts',
            value: statsData.totalPosts,
        },
        {
            name: 'Total Followers',
            value: statsData.totalFollowers,
        },
    ];

    const statElements = stats?.map((item) => (
        <div
            key={item.name}
            className="border-[0.01rem] rounded-lg p-4 bg-slate-900"
        >
            <div className="text-2xl font-medium">{item.name}</div>
            <div className="mt-4 text-xl">{item.value}</div>
        </div>
    ));

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, postsLoading, setPage);

    const postElements = posts
        ?.filter((post) => {
            const title = post.post_title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return post;
            if (!search) return post;
        })
        .map((post, index) => (
            <AdminPostRow
                key={post.post_id}
                post={post}
                setPosts={setPosts}
                reference={posts.length === index + 1 ? paginateRef : null}
            />
        ));

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="pl-4">
                    <div className="size-[125px] overflow-hidden rounded-full">
                        <img
                            src={user.user_avatar}
                            alt="user avatar"
                            className="object-cover size-full"
                        />
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-medium">
                            Welcome Back, {user.user_firstName}{' '}
                            {user.user_lastName}
                        </div>
                        <div className="text-sm mt-1 text-[#c2c2c2]">
                            Track you channel's progress, Seamless post
                            Management & Elevated Results.
                        </div>
                    </div>
                </div>

                <div>
                    <Button
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <div className="size-[20px] fill-white">
                                    {icons.plus}
                                </div>
                                <div>New Post</div>
                            </div>
                        }
                        onClick={() => navigate('/add-post')}
                    />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                {statElements}
            </div>

            <div className="mt-10 w-full">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search"
                    className="bg-transparent rounded-full border-[0.01rem] p-1 indent-2 max-w-[500px] w-[50%]"
                />
            </div>

            <div className="overflow-x-scroll mt-10 w-full">
                <table className=" border-[0.1rem] border-[#b5b4b4] w-full text-nowrap text-[#efefef]">
                    <thead>
                        <tr className="w-full border-b-[0.1rem] border-[#b5b4b4]">
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Toggle
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Visibility
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Post
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Category
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Date uploaded
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Views
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Comments
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Ratings
                            </th>
                            <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                Options
                            </th>
                        </tr>
                    </thead>

                    <tbody>{postElements}</tbody>
                </table>

                {postsLoading &&
                    (page === 1 ? (
                        <div className="w-full text-center">
                            loading first batch...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center my-2 w-full">
                            <div className="size-7 fill-[#8871ee] dark:text-[#b5b4b4]">
                                {icons.loading}
                            </div>
                            <span className="text-xl ml-3">Please wait...</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
