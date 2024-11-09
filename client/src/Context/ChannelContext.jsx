import { createContext, useContext, useState } from 'react';

const ChannelContext = createContext();

export const ChannelContextProvider = ({ children }) => {
    const [channel, setChannel] = useState(null);

    return (
        <ChannelContext.Provider value={{ channel, setChannel }}>
            {children}
        </ChannelContext.Provider>
    );
};

export default function useChannelContext() {
    return useContext(ChannelContext);
}
