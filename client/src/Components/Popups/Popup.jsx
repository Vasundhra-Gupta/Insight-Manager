import { usePopupContext } from "../../Context";

export default function Popup() {
    const { showPopup, popupText } = usePopupContext();
    console.log("hello");
    return (
        showPopup && (
            <div className="text-black text-lg fixed top-4 right-4 p-4 bg-white shadow-lg rounded-lg">
                <div>{popupText}</div>
            </div>
        )
    );
}
