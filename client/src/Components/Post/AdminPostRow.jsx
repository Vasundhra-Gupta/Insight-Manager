import { icons } from "../../Assets/icons";
import { formatDateExact } from "../../Utils/formatDate";
import { Button } from "..";
import { postService } from "../../Services/postService";
import { useNavigate } from "react-router-dom";

export default function AdminPostRow({ post, reference, setPosts }) {
    const {
        post_id,
        post_title,
        post_image,
        post_visibility,
        post_createdAt,
        totalLikes,
        totalDislikes,
        category_name,
        totalViews,
        totalComments,
    } = post;

    const navigate = useNavigate();

    async function togglePostVisibility() {
        try {
            const res = await postService.togglePostVisibility(post_id);
            if (res && !res.message) {
                setPosts((prev) =>
                    prev.map((post) => {
                        if (post.post_id === post_id) {
                            return {
                                ...post,
                                post_visibility: !post.post_visibility,
                            };
                        } else return post;
                    })
                );
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    async function deletePost() {
        try {
            const res = await postService.deletePost(post_id);
            if (res && res.message === "DELETION_SUCCESSFULL") {
                setPosts((prev) => prev.filter((post) => post.post_id !== post_id));
            }
        } catch (err) {
            navigate("/server-error");
        }
    }

    return (
        <tr ref={reference} className="border-b-[0.01rem] border-b-slate-600">
            <td className="">
                <div className="flex items-center justify-center">
                    <label
                        htmlFor={post_id}
                        className="relative inline-block w-12 cursor-pointer overflow-hidden"
                    >
                        <input
                            type="checkbox"
                            id={post_id}
                            className="peer sr-only"
                            checked={post_visibility}
                            onChange={togglePostVisibility}
                        />

                        <span className="inline-block h-6 w-12 rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7" />
                    </label>
                </div>
            </td>

            <td className="text-center px-8">
                <div className="w-[130px] flex items-center justify-center">
                    {post_visibility ? (
                        <div className="border-[0.01rem] border-[#008300] text-lg rounded-full px-3 py-[2px] text-[#008300]">
                            Published
                        </div>
                    ) : (
                        <div className="border-[0.01rem] border-[#ba0000] text-lg rounded-full px-3 py-[2px] text-[#ba0000]">
                            Unpublished
                        </div>
                    )}
                </div>
            </td>

            <td className="py-[13px]">
                <div
                    onClick={() => navigate(`/post/${post_id}`)}
                    className="flex items-center justify-start w-full cursor-pointer"
                >
                    <div className="size-[45px] rounded-full overflow-hidden">
                        <img src={post_image} alt={post_title} className="size-full object-cover" />
                    </div>
                    <div className="text-[1.1rem] font-medium ml-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[250px]">
                        {post_title}
                    </div>
                </div>
            </td>

            <td className=" text-center text-[1.1rem]">{category_name}</td>
            <td className=" text-center text-[1.1rem]">{formatDateExact(post_createdAt)}</td>
            <td className=" text-center text-[1.1rem] ">{totalViews}</td>
            <td className=" text-center text-[1.1rem]">{totalComments}</td>

            <td className="">
                <div className="flex items-center justify-center">
                    <div className="rounded-[12px] bg-[#d4ffd4] px-2 py-[2px] text-[#196619] text-[1.1rem]">
                        {totalLikes} likes
                    </div>
                    <div className="rounded-[12px] bg-[#ffd2d2] px-2 py-[2px] ml-4 text-[#ba2828] text-[1.1rem]">
                        {totalDislikes} dislikes
                    </div>
                </div>
            </td>

            <td className="">
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={deletePost}
                        className="size-[27px] fill-none stroke-[#b5b4b4] hover:stroke-[#a40000] "
                        btnText={<div className="size-[20px] fill-black">{icons.delete}</div>}
                    />
                    <Button
                        onClick={() => navigate(`/update/:${post_id}`)}
                        className="size-[25px] fill-none stroke-[#b5b4b4] hover:stroke-[#8871ee]"
                        btnText={<div className="size-[20px] fill-black">{icons.edit}</div>}
                    />
                </div>
            </td>
        </tr>
    );
}
