import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileRestrictions, verifyExpression } from "../Utils";
import { Button, RTE } from "../Components";
import { usePopupContext } from "../Context";
import { postService } from "../Services";

export default function AddPostPage() {
    const [inputs, setInputs] = useState({
        title: "",
        postImage: null,
        content: "",
        category: "",
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const { setShowPopup, setPopupText } = usePopupContext();
    const [error, setError] = useState({
        title: "",
        postImage: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const { files, name } = e.target;
        if (files && files[0]) {
            const file = files[0];

            setInputs((prev) => ({ ...prev, [name]: file }));
            fileRestrictions(file, name, setError);

            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setError((prevError) => ({ ...prevError, postImage: "thumbnail is required." }));
        }
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (value) {
            verifyExpression(name, value, setError);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await postService.addPost(inputs);
            if (res && !res.message) {
                setPopupText("Post Created Successfully");
                setShowPopup(true);
                navigate(`/post/${postId}`);
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setLoading(false);
        }
    }

    function onMouseOver() {
        if (
            Object.values(inputs).some((value) => !value) ||
            Object.values(error).some((error) => error)
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    const categories = ["Art", "Science", "Sci-Fi", "Entertainment", "Technical", "Others"];

    const categoryElements = categories?.map((category) => (
        <div key={category} className="flex items-center justify-start gap-2">
            <input
                type="radio"
                name="category"
                id={category}
                value={category}
                checked={inputs.category === category} // just good for verification
                onChange={handleChange}
            />
            <label htmlFor={category}>{category}</label>
        </div>
    ));

    return (
        <div className="w-full h-full overflow-scroll p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full h-full flex items-start justify-start gap-8"
            >
                <div className="w-[70%] h-full">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <div className="flex items-center justify-start gap-2">
                                <label htmlFor="title">
                                    <span className="text-red-500">* </span>Title :
                                </label>
                                {error.title && (
                                    <div className="pt-[0.09rem] text-red-500 text-sm">
                                        {error.title}
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Post Title"
                                    name="title"
                                    id="title"
                                    onChange={handleChange}
                                    value={inputs.title}
                                    onBlur={handleBlur}
                                    className="bg-transparent border-[0.01rem] text-white p-1 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-start gap-2">
                                <label htmlFor="postImage">
                                    <span className="text-red-500">* </span>Thumbnail :
                                </label>
                                {error.postImage && (
                                    <div className="pt-[0.09rem] text-red-500 text-sm">
                                        {error.postImage}
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    name="postImage"
                                    id="postImage"
                                    className="bg-transparent border-[0.01rem] text-white p-1 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-10">
                        <div>
                            <span className="text-red-500">* </span>Content :
                        </div>
                        <RTE
                            onChange={() =>
                                setInputs((prev) => ({
                                    ...prev,
                                    content: tinymce.activeEditor.getContent(),
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="h-full w-[30%]">
                    <div className="w-full flex items-center justify-center">
                        <div className="w-[70%] h-[180px] rounded-lg overflow-hidden">
                            <img
                                src={thumbnailPreview}
                                alt="thumbnail preview"
                                className="object-cover h-full w-full border-[0.01rem] rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="w-full mt-8">
                        <div>
                            <span className="text-red-500">* </span>Category :
                        </div>
                        <div className="mt-2">{categoryElements}</div>
                    </div>

                    <div className="w-full text-center mt-10">
                        <Button
                            btnText={loading ? "Uploading..." : "Upload"}
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
