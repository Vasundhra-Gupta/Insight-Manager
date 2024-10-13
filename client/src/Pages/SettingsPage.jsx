import { Outlet } from "react-router-dom";
import { Button, UpdateAvatarPopup, UpdateCoverImagePopup } from "../Components";
import useUserContext from "../Context/UserContext";
import { icons } from "../Assets/icons";
import { useState } from "react";

export default function SettingsPage() {
    const { user, setUser } = useUserContext();
    const [updateAvatarPopup, setUpdateAvatarPopup] = useState(false);
    const [updateCoverImagePopup, setUpdateCoverImagePopup] = useState(false);

    return (
        <div className="w-full h-full overflow-scroll">
            <div className="w-full">
                {/* coverImage */}
                <div className="w-full relative">
                    <div className="h-[190px] w-full">
                        <img
                            alt="user coverImage"
                            src={user.user_coverImage}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div>
                        <Button
                            btnText={icons.upload}
                            onClick={() => setUpdateCoverImagePopup(true)}
                            className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] size-[35px] rounded-md p-1 bg-[#b5b4b4] border-[0.01rem] border-[#bbbbbb] bg-opacity-70 stroke-black fill-[#4d4d4d]"
                        />
                    </div>
                </div>

                {/* avatar */}
                <div className="w-fit relative ">
                    <div className="size-[120px]">
                        <img
                            alt="user avatar"
                            src={user.user_avatar}
                            className="rounded-full size-full object-cover"
                        />
                    </div>

                    <div>
                        <Button
                            btnText={icons.upload}
                            onClick={() => setUpdateAvatarPopup(true)}
                            className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] size-[35px] rounded-md p-1 bg-[#b5b4b4] border-[0.01rem] border-[#bbbbbb] bg-opacity-70 stroke-black fill-[#4d4d4d]"
                        />
                    </div>
                </div>

                {/* channel info*/}
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
                {updateCoverImagePopup && (
                    <UpdateCoverImagePopup setUpdateCoverImagePopup={setUpdateCoverImagePopup} />
                )}
            </div>

            {/* difference sections */}
            <Outlet />
        </div>
    );
}
