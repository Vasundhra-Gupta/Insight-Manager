import useUserContext from "../../Context/UserContext";
import { useState } from "react";
import Button from "..";
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

    async function handleChange(e) {
        const { files, name } = e.target;
        if (files[0]) {
            setCoverImage(files[0]);
            fileRestrictions(files[0], name, setError);

            const reader = new FileReader();

            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
            };

            reader.readAsDataURL(files[0]);
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
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" name="coverImage" id="coverImage" className="hidden" onChange={handleChange} ref={ref} />

                {/* cross */}

                <div>
                    <Button
                        type="button"
                        btnText={<div className="size-[23px] fill-none stroke-slate-700">{icons.cross}</div>}
                        onClick={() => {
                            setUpdateCoverImagePopup(false);
                        }}
                        className="absolute top-1 right-1 bg-transparent"
                    />
                </div>

                {/* preview */}
                <div className="w-full flex items-center justify-center">
                    <Button
                        type="button"
                        btnText={
                            <Image
                                altText="preview"
                                src={coverImagePreview}
                                className={`size-[150px] rounded-full border-[0.2rem] ${error.coverImage ? "border-red-500" : "border-green-500"}`}
                            />
                        }
                        onClick={() => ref.current.click()}
                        className="rounded-full size-fit overflow-hidden"
                    />
                </div>

                {/* upload */}
                <div className="w-full mt-4 flex items-center justify-center">
                    <Button btnText={loading ? "Uploading..." : "Upload"} disabled={disabled} onMouseOver={onMouseOver} type="submit" />
                </div>
            </form>
        </div>
    );
}
