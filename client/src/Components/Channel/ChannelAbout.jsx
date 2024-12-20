import { NavLink } from 'react-router-dom';
import { useChannelContext, usePopupContext } from '../../Context';
import { formatDateExact } from '../../Utils';
import { icons } from '../../Assets/icons';

export default function ChannelAbout() {
    const { channel } = useChannelContext();
    const { setPopupText, setShowPopup } = usePopupContext();
    const {
        user_name,
        user_firstName,
        user_lastName,
        user_bio,
        user_createdAt,
        user_email,
        totalChannelViews,
        totalFollowers,
        totalPosts,
    } = channel;

    function copyEmail() {
        window.navigator.clipboard.writeText(user_email);
        setShowPopup(true);
        setPopupText('Email Copied to Clipboard 🤗');
    }

    return (
        <div>
            <div className="mb-6">
                <div className="text-2xl">
                    {user_firstName} {user_lastName}
                </div>
                <div className="text-xl">@{user_name}</div>
                <div>{user_bio}</div>
            </div>

            <div className="text-2xl mb-4">Channel details</div>

            <div className="flex flex-col gap-2 items-start justify-start mt-2 text-lg">
                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">
                        {icons.email}
                    </div>

                    <div className="flex  items-center justify-center gap-1">
                        <div className="cursor-pointer text-blue-600 hover:text-blue-700 ">
                            {user_email}
                        </div>

                        <div
                            className="size-[15px] hover:fill-[#ffffff] cursor-pointer fill-[#b5b4b4]"
                            onClick={copyEmail}
                        >
                            {icons.clipboard}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[23px] fill-[#b5b4b4]">
                        {icons.globe}
                    </div>
                    <NavLink
                        to={`/channel/${user_name}`}
                        className="text-blue-600 hover:text-blue-700 pb-1"
                    >
                        {`https://note-manager/channel/${user_name}`}
                    </NavLink>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">
                        {icons.people}
                    </div>
                    <div>{totalFollowers} followers</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">
                        {icons.posts}
                    </div>
                    <div>{totalPosts} posts</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">
                        {icons.eye}
                    </div>
                    <div>{totalChannelViews} views</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[#b5b4b4]">
                        {icons.date}
                    </div>
                    <div>Joined on {formatDateExact(user_createdAt)}</div>
                </div>
            </div>
        </div>
    );
}
