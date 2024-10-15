import { useRef } from "react";
import { UpdateCoverImage } from "..";

export default function UpdateCoverImagePopup({ setUpdateCoverImagePopup }) {
    const ref = useRef();
    function handleClick(e) {
        if (e.target === ref.current) {
            setUpdateCoverImagePopup(false);
        }
    }
    return (
        <div
            onClick={handleClick}
            ref={ref}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
        >
            <UpdateCoverImage setUpdateCoverImagePopup={setUpdateCoverImagePopup} />
        </div>
    );
}
