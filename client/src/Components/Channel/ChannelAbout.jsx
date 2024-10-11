import useChannelContext from "../../Context/ChannelContext";
import { NavLink } from "react-router-dom";
import { formatDateExact } from "../../Utils/formatDate";
import { icons } from "../../assets/icons";

export default function ChannelAbout() {
    const { channel } = useChannelContext();
    const {
        userName,
        firstName,
        lastName,
        bio,
        createdAt,
        email,
        totalChannelViews,
        totalFollowers,
        totalPosts,
    } = channel;

    function copyEmail() {}

    return (
        <div>
            <div className="mb-6">
                <div className="text-2xl">
                    {firstName} {lastName}
                </div>
                <div className="text-xl">@{userName}</div>
                <div>{bio}</div>
            </div>

            <div className="text-2xl mb-4">Channel details</div>

            <div className="flex flex-col gap-2 items-start justify-start mt-2 text-lg">
                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">{icons.email}</div>
                    <div className="cursor-pointer text-blue-600" onClick={copyEmail}>
                        {email}
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[23px] fill-[#b5b4b4]">{icons.globe}</div>
                    <NavLink to={`/channel/${userName}`} className="text-blue-500 pb-1">
                        {`https://note-manager/channel/${userName}`}
                    </NavLink>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">{icons.usersGroup}</div>
                    <div>{totalFollowers} followers</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">{icons.posts}</div>
                    <div>{totalPosts} posts</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">{icons.eye}</div>
                    <div>{totalChannelViews} views</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">{icons.date}</div>
                    <div>Joined on {formatDateExact(createdAt)}</div>
                </div>
            </div>
        </div>
    );
}
