import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postService } from "../../Services/postService";
import fileRestrictions from "../../Utils/fileRestrictions";

export default function UpdatePostImage() {
    const { post_id } = useParams();
    const [postImage, setPostImage] = useState({
        postImage: post.post_image,
    });
    const [postImagePreview, setPostImagePreview]= useState(null);
    const [error, setError] = useState({
        title: "",
        postImage: "",
    });
    const navigate = useNavigate();
    const [loading, setLoading]= useState(false);
    const [disabled, setDisabled]= useState(false);


    useEffect(() => {
        (async function () {
            const post = await postService.getPost(post_id);
            return post;
        })();
    }, [post_id]);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try{
            const res= await postService.updatePostImage(postImage);
            if(res && !res.message){
                navigate(`channel/${post_id}`)
            }
        }catch(err){
            navigate("/server-error")
        }finally{
            setLoading(false);
            setDisabled(false);
        }
    }

    function handleBlur(e) {

    }

    function onMouseOver(){
        if(error.postImage){
            setDisabled(true);
        }else{
            setDisabled(false);
        }
    }

    function handleFileChange(e) {
        const {files, name} = e.target;
        if(files && files[0]){
            const file= files[0];
            setPostImage(file);
            fileRestrictions(file, name, setError);
            
            const reader= new FileReader();
            reader.onloadend(()=>{
                setPostImagePreview(reader.result);
            })
            reader.readAsDataURL(file)
        }else{
            setError((prev)=>({
                ...prev, postImage: "postImage is required."
            }))
        }
    }
    return (
        <div className="w-full h-full overflow-scroll p-4">
            <form onSubmit={handleSubmit} className="w-full h-full flex items-start justify-start gap-8">
                <div className="w-[70%] h-full">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <div className="flex items-center justify-start gap-2">
                                <label htmlFor="title">
                                    <span className="text-red-500">* </span>Title :
                                </label>
                                {error.title && <div className="pt-[0.09rem] text-red-500 text-sm">{error.title}</div>}
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
                                {error.postImage && <div className="pt-[0.09rem] text-red-500 text-sm">{error.postImage}</div>}
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
                            defaultValue={defaultValue}
                            height={450}
                            width={"full"}
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
                            <img src={postImagePreview} alt="thumbnail preview" className="object-cover h-full w-full border-[0.01rem] rounded-lg" />
                        </div>
                    </div>

                    <div className="w-full mt-8">
                        <div>
                            <span className="text-red-500">* </span>Category :
                        </div>
                        <div className="mt-2">{categoryElements}</div>
                    </div>

                    <div className="w-full text-center mt-10">
                        <Button btnText={loading ? "Uploading..." : "Update"} type="submit" disabled={disabled} onMouseOver={onMouseOver} />
                    </div>
                </div>
            </form>
        </div>
    );
}
