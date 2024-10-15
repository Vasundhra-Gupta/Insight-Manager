import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { commentService } from "../../Services";
import { Comment, Button } from "..";

export default function Comments({ postId }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingComment, setAddingComment] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        (async function getComments() {
            try {
                setLoading(true);
                const res = await commentService.getComments(postId);
                if (res && !res.message) {
                    setComments(res);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, [postId]);

    async function addComment(e) {
        e.preventDefault();
        try {
            if (!input) return;
            setAddingComment(true);
            const res = await commentService.addComment(postId, input);
            if (res && !res.message) {
                setComments((prev) => [
                    ...prev,
                    {
                        user_id: res.user_id,
                        post_id: res.post_id,
                        comment_id: res.comment_id,
                        comment_content: res.comment_content,
                        comment_createdAt: res.comment_createdAt,
                    },
                ]);
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setAddingComment(false);
            setInput("");
        }
    }

    const commentElements = comments?.map((comment) => (
        <Comment key={comment.comment_id} commentId={comment.comment_id} />
    ));

    return loading ? (
        <div>loading...</div>
    ) : comments.length > 0 ? (
        <div>
            <div>{comments.length} Comments</div>

            <div>
                <form onSubmit={addComment} className="flex  items-center justify-start gap-2">
                    <input
                        type="text"
                        placeholder="Add a new Comment"
                        name="comment"
                        id="comment"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-[0.01rem] rounded-lg indent-2 p-1"
                    />
                    <Button type="reset" btnText="Cancel" onClick={(e) => setInput("")} />
                    <Button
                        type="submit"
                        btnText={addingComment ? "adding..." : "Comment"}
                        disabled={addingComment}
                    />
                </form>
            </div>

            <div>{commentElements}</div>
        </div>
    ) : (
        <div>No Comments Found !!</div>
    );
}
