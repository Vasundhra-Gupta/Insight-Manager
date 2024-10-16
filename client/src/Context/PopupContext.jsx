import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupContextProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loginPopupText, setLoginPopupText] = useState("");
    const [popupText, setPopupText] = useState("");

    return (
        <PopupContext.Provider
            value={{
                showPopup,
                popupText,
                showLoginPopup,
                loginPopupText,
                setShowPopup,
                setPopupText,
                setShowLoginPopup,
                setLoginPopupText,
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export default function usePopupContext() {
    return useContext(PopupContext);
}
