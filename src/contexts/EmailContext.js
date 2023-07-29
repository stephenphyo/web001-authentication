import { createContext, useState } from "react";

/* Context */
const EmailContext = createContext();
export default EmailContext;

/* Context Provider */
export const EmailContextProvider = (props) => {

    /* useState */
    const [email, setEmail] = useState({});

    /* Context Values */
    const value = {
        email, setEmail
    };

    return (
        <EmailContext.Provider value={value}>
            {props.children}
        </EmailContext.Provider>
    )
};