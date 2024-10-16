import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupContextProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    
    return (
        <PopupContext.Provider value={{ showPopup, setShowPopup, popupText, setPopupText }}>
            {children}
        </PopupContext.Provider>
    );
};

export default function usePopupContext() {
    return useContext(PopupContext);
}
