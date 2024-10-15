import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, RTE } from "../Components";
import { verifyExpression, fileRestrictions } from "../Utils";
import { postService } from "../Services";
import { useUserContext } from "../Context";

export default function UpdatePostPage() {
    const [inputs, setInputs] = useState({
        title: "",
        postImage: null,
        content: "",
        category: "",
    });
    const [error, setError] = useState({
        title: "",
        postImage: "",
    });
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [defaultRTEValue, setDefaultRTEValue] = useState("");
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        (async function getPost() {
            try {
                setLoading(true);
                const res = await postService.getPost(postId);
                if (res && !res.message) {
                    setPost(res);
                    setInputs({
                        title: res.post_title,
                        postImage: null,
                        content: res.post_content,
                        category: res.category_name,
                    });
                    setDefaultRTEValue(res.post_content);
                    setThumbnailPreview(res.post_image);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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
            setUploading(true);
            setDisabled(true);
            const res = await postService.updatePostDetails(
                {
                    title: inputs.title,
                    category: inputs.category,
                    content: inputs.content,
                },
                postId
            );
            const res1 = await postService.updatePostImage(inputs.postImage, postId);
            if (res && res1 && !res.message && !res1.message) {
                navigate(`/post/${postId}`);
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setUploading(false);
            setDisabled(false);
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
                checked={inputs.category === category}
                onChange={handleChange}
            />
            <label htmlFor={category}>{category}</label>
        </div>
    ));

    return loading ? (
        <div>loading...</div>
    ) : user.user_name === post.userName ? (
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
                            defaultValue={defaultRTEValue}
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
                            btnText={uploading ? "Updating..." : "Update"}
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                        />
                    </div>
                </div>
            </form>
        </div>
    ) : (
        <div>You're not authorized for this operation.</div>
    );
}
