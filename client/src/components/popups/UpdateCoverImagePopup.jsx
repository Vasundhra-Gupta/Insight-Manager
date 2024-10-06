import UpdateCoverImage from "../User/UpdateCoverImage";
import { useRef } from "react";

export default function UpdateCoverImagePopup({setUpdateCoverImagePopup}){
    const ref= useRef();
    function handleClick(e){
        if(e.target===ref.current){
            setUpdateCoverImagePopup(false);
        }
    }
    return (
        <div 
            onClick={handleClick}
            ref={ref}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
        >
            <UpdateCoverImage 
            setUpdateCoverImagePopup={setUpdateCoverImagePopup}
            className="bg-orange-200 w-fit h-fit p-4 rounded-xl"
            />
        </div>
    );
}

