import { Outlet } from "react-router-dom";
import { Image, Button, UpdateAvatarPopup } from "../Components";
import useUserContext from "../Context/UserContext";
import { icons } from "../assets/icons";
import { useState } from "react";

export default function SettingsPage() {
    const { user, setUser } = useUserContext();
    const [updateAvatarPopup, setUpdateAvatarPopup] = useState(false);
    return (
        <div>
            <div>SettingsPage</div>
            <div className="w-full">
                {/* coverImage */}
                {/* <UpdateCoverImage /> */}

                {/* avatar */}
                <div className="w-fit relative ">
                    <Image
                        altText="user avatar"
                        src={user.user_avatar}
                        className="rounded-full size-[120px]"
                    />

                    <Button
                        btnText={icons.upload}
                        onClick={() => setUpdateAvatarPopup(true)}
                        className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] size-[35px] rounded-md p-1 bg-[#b5b4b4] border-[0.01rem] border-[#bbbbbb] bg-opacity-70 stroke-black fill-[#4d4d4d]"
                    />
                </div>

                <div>
                    <div className="text-2xl font-medium">
                        {user.user_firstName} {user.user_lastName}
                    </div>
                    <div className="text-lg text-[#afafaf]">@{user.user_name}</div>
                </div>
            </div>

            {/* popups */}
            <div>
                {updateAvatarPopup && (
                    <UpdateAvatarPopup setUpdateAvatarPopup={setUpdateAvatarPopup} />
                )}
            </div>
            <Outlet />
        </div>
    );
}
