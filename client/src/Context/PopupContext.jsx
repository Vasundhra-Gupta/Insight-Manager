import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PopupContext = createContext();

export const PopupContextProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loginPopupText, setLoginPopupText] = useState("");

    const location = useLocation();

    useEffect(() => {
        setLoginPopupText("");
        setShowLoginPopup(false);
    }, [location]);

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
