import { useEffect, useState } from "react";
import { Button } from "../Components";
import { userService } from "../Services/userService";
import { followerService } from "../Services/followerService";
import { useParams, useNavigate, NavLink, Outlet } from "react-router-dom";
import useChannelContext from "../Context/ChannelContext";

export default function ChannelPage() {
    const { userName } = useParams();
    const navigate = useNavigate();
    const { channel, setChannel } = useChannelContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function getChannelProfile() {
            try {
                setLoading(true);
                const res = await userService.getChannelProfile(userName);
                if (res && !res.message) {
                    setChannel(res);
                } else {
                    setChannel(null);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [userName]);

    async function toggleFollow() {
        const res = await followerService.toggleFollow(channel.userId);
        // pending
    }

    const tabs = [
        { name: "posts", path: "" },
        { name: "About", path: "about" },
    ];

    const tabElements = tabs?.map((tab) => (
        <NavLink
            key={tab.name}
            to={tab.path}
            end
            className={({ isActive }) =>
                `${isActive ? "border-[#8871ee]" : "border-white"} border-b-[0.01rem] w-full`
            }
        >
            <div className="w-full text-center">{tab.name}</div>
        </NavLink>
    ));

    return loading ? (
        <div>loading...</div>
    ) : channel ? (
        <div className="w-full h-full overflow-scroll p-[5px]">
            {/* owner coverImage */}
            <div className="w-full h-[200px] overflow-hidden">
                <img
                    src={channel.coverImage}
                    alt="channel coverImage"
                    className="object-cover h-full w-full"
                />
            </div>

            {/* owner channel info */}
            <div className="flex items-center justify-between w-full pr-2 relative -top-3">
                <div className="flex items-center justify-start gap-4">
                    {/* owner avatar */}
                    <div className="relative -top-2">
                        <div className="size-[120px] rounded-full overflow-hidden border-[0.3rem] border-black">
                            <img
                                src={channel.avatar}
                                alt="channel owner avatar"
                                className="object-cover size-full"
                            />
                        </div>
                    </div>

                    {/* owner info */}
                    <div>
                        <div className="text-xl font-medium">
                            {channel.firstName} {channel.lastName}
                        </div>

                        <div className="text-[#dadada] text-[17px]">@{channel.userName}</div>

                        <div className="flex gap-1 items-center justify-start text-[#a5a5a5] text-[15px]">
                            {channel.totalFollowers} followers &bull; {channel.totalFollowings}{" "}
                            followings
                        </div>
                    </div>
                </div>

                {/* follow btn */}
                <div className="bg-blue-400">
                    <Button
                        btnText={channel.isFollowed ? "UnFollow" : "Follow"}
                        onClick={toggleFollow}
                    />
                </div>
            </div>

            {/* tabs */}
            <div className="flex gap-2 justify-evenly w-full px-2">{tabElements}</div>

            <hr className="mt-2" />

            <div>
                <Outlet />
            </div>
        </div>
    ) : (
        <div>Channel Not Found !!</div>
    );
}
