//Imports
import { useState, useEffect } from "react";

const useAuth = () => {
    const [token, setToken] = useState ( () => localStorage.getItem ("token") );
    const [isAuthenticated, setIsAuthenticated] = useState (!!token);

    const saveToken = (jwt) => {
        localStorage.setItem (token, jwt);
        setToken (jwt);
        setIsAuthenticated (true);
    };

    const logout = () => {
        localStorage.removeItem ("token");
        setToken (null);
        setIsAuthenticated (false);
    };

    useEffect ( () => {
        setIsAuthenticated (!!token);
    }, [token]);

    return {
        token,
        isAuthenticated,
        saveToken,
        logout,
    }
};

export default useAuth; 