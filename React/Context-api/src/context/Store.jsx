import { createContext, useContext } from "react";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
    const data = "hello world";
    return (
        <StoreContext.Provider value={data}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    return useContext(StoreContext);
};
