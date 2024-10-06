import useUserContext from "../../Context/UserContext";
import { userService } from "../../Services/userService";
import { useState, useRef } from "react";
import { Button, Image } from "..";
import { icons } from "../../assets/icons";
import fileRestrictions from "../../Utils/fileRestrictions";

export default function UpdateAvatar({ className, setUpdateAvatarPopup }) {
    const { user, setUser } = useUserContext();
    const [error, setError] = useState({
        avatar: "", // have to take object due to regex
    });
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.user_avatar);
    const [avatar, setAvatar] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const ref = useRef();

    async function handleChange(e) {
        const { files, name } = e.target;
        if (files[0]) {
            setAvatar(files[0]);
            fileRestrictions(files[0], name, setError);
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }

    function onMouseOver() {
        if (error.avatar) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        try {
            const res = await userService.updateAvatar(avatar);
            if (res && !res.message) {
                setUser(res);
            } else {
                // popup something went wrong !!
                return;
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setLoading(false);
            setDisabled(false);
            setUpdateAvatarPopup(false);
        }
    }

    return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    onChange={handleChange}
                    ref={ref}
                />

                {/* cross */}
                <div>
                    <Button
                        type="button"
                        btnText={
                            <div className="size-[23px] fill-none stroke-slate-700">
                                {icons.cross}
                            </div>
                        }
                        onClick={() => {
                            setUpdateAvatarPopup(false);
                        }}
                        className="absolute top-1 right-1 bg-transparent"
                    />
                </div>

                {/* select btn */}
                <div className="w-full flex items-center justify-center">
                    <Button
                        btnText={
                            <Image
                                src={avatarPreview}
                                altText="preview"
                                className={`size-[150px] rounded-full border-[0.2rem] ${
                                    error.avatar ? "border-red-500" : "border-green-500"
                                }`}
                            />
                        }
                        type="button"
                        className="rounded-full size-fit overflow-hidden"
                        onClick={() => ref.current.click()}
                    />
                </div>

                {error.avatar && (
                    <div className="texxt-sm text-red-500 w-full text-center">{error.avatar}</div>
                )}

                {/* upload btn */}
                <div className="w-full mt-4 flex items-center justify-center">
                    <Button
                        btnText={loading ? "Uploading..." : "Upload"}
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
}
