import { createContext, useContext, useState } from 'react';

const SideBarContext = createContext();

export const SideBarContextProvider = ({ children }) => {
    const [showSideBar, setShowSideBar] = useState(false);

    return (
        <SideBarContext.Provider value={{ showSideBar, setShowSideBar }}>
            {children}
        </SideBarContext.Provider>
    );
};

export default function useSideBarContext() {
    return useContext(SideBarContext);
}
