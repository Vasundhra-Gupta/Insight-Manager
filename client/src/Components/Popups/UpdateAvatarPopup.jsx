import { UpdateAvatar } from "..";
import { useRef } from "react";

export default function UpdateAvatarPopup({ setUpdateAvatarPopup }) {
    const ref = useRef();
    function handleClick(e) {
        if (e.target === ref.current) {
            setUpdateAvatarPopup(false);
        }
    }
    return (
        <div
            onClick={handleClick}
            ref={ref}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
        >
            <UpdateAvatar setUpdateAvatarPopup={setUpdateAvatarPopup} />
        </div>
    );
}
