import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../Services';
import { Button, PostListView } from '..';
import { icons } from '../../Assets/icons';

export default function SavedPostView({ post, reference }) {
    const { post_id } = post;
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    async function toggleSave() {
        try {
            const res = await postService.toggleSavePost(post_id);
            if (res) {
                res.message === 'POST_SAVED_SUCCESSFULLY'
                    ? setIsSaved(true)
                    : setIsSaved(false);
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <PostListView post={post} reference={reference}>
            {/* children */}
            <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation}
            >
                <Button
                    btnText={
                        <div className="size-[20px]">
                            {isSaved ? icons.undo : icons.delete}
                        </div>
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSave();
                    }}
                />
            </div>
        </PostListView>
    );
}
