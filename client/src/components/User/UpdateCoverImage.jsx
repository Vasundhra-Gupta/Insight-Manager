import useUserContext from "../../Context/UserContext";
import { useState, useRef } from "react";
import { Button, Image } from "..";
import fileRestrictions from "../../Utils/fileRestrictions";
import { icons } from "../../assets/icons";
import { userService } from "../../Services/userService";
import { useNavigate } from "react-router-dom";

export default function UpdateCoverImage({ className, setUpdateCoverImagePopup }) {
    const { user, setUser } = useUserContext();
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState({
        coverImage: "",
    });
    const [coverImagePreview, setCoverImagePreview] = useState(user.user_coverImage);
    const navigate = useNavigate();
    const ref = useRef();

    async function handleChange(e) {
        const { files, name } = e.target;
        if (files[0]) {
            const file = files[0];
            setCoverImage(file);
            fileRestrictions(file, name, setError);

            const reader = new FileReader();

            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }

    function onMouseOver() {
        if (error.coverImage) {
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
            const res = await userService.updateCoverImage(coverImage);
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
            setUpdateCoverImagePopup(false);
        }
    }

    return (
        <div className={`relative w-[300px] sm:w-[400px] md:w-[500px] ${className}`}>
            <div className="w-full text-center text-2xl font-semibold mb-4 text-black">
                Update Cover Image
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center gap-4"
            >
                <input
                    type="file"
                    name="coverImage"
                    id="coverImage"
                    className="hidden"
                    onChange={handleChange}
                    ref={ref}
                />

                {/* preview */}
                <div className="w-full flex items-center justify-center">
                    <Button
                        type="button"
                        btnText={
                            <Image
                                altText="preview"
                                src={coverImagePreview}
                                className={`size-full rounded-xl border-[0.2rem] ${
                                    error.coverImage ? "border-red-500" : "border-green-500"
                                }`}
                            />
                        }
                        onClick={() => ref.current.click()}
                        className="size-fit rounded-xl overflow-hidden bg-red-400"
                    />
                </div>

                {error.coverImage && (
                    <div className="text-sm text-red-500 w-full text-center">
                        {error.coverImage}
                    </div>
                )}

                {/* sbumit btn */}
                <div className="w-full flex items-center justify-center">
                    <Button
                        btnText={loading ? "Uploading..." : "Upload"}
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                        type="submit"
                    />
                </div>
            </form>

            {/* cross */}
            <div>
                <Button
                    type="button"
                    btnText={
                        <div className="size-[23px] fill-none stroke-slate-700">{icons.cross}</div>
                    }
                    onClick={() => {
                        setUpdateCoverImagePopup(false);
                    }}
                    className="absolute top-1 right-1 bg-transparent"
                />
            </div>
        </div>
    );
}
