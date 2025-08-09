import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import {
    userReducer,
    initialUserState,
    USER_ACTIONS,
} from "../reducers/userReducer";
import Apis, { endpoints } from "../configs/Apis";

const AppContext = React.createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true); // Track auth restoration
    const [error, setError] = useState(null);

    // Check for existing token on app load
    useEffect(() => {
        const restoreAuth = async () => {
            const token = cookie.load("token");
            const userData = cookie.load("userData");

            if (token) {
                if (userData) {
                    try {
                        const user =
                            typeof userData === "string" ? JSON.parse(userData) : userData;
                        userDispatch({
                            type: USER_ACTIONS.LOGIN,
                            payload: { user, token },
                        });
                    } catch (error) {
                        // Clear invalid data
                        cookie.remove("token", { path: "/" });
                        cookie.remove("userData", { path: "/" });
                    }
                }
            }

            setIsAuthLoading(false); // Auth restoration complete
        };

        restoreAuth();
    }, []);

    // Auth functions
    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await Apis.post(endpoints["login"], {
                username: credentials.username,
                password: credentials.password,
            });
            
            if (response.status === 200) {
                const { token } = response.data;

                // Store token in cookies with expiration
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);

                cookie.save("token", token, { path: "/", expires });

                // Store user data in cookies
                const user = response.data.user || { username: credentials.username };
                cookie.save("userData", JSON.stringify(user), {
                    path: "/",
                    expires,
                });

                userDispatch({
                    type: USER_ACTIONS.LOGIN,
                    payload: { user, token },
                });

                setIsLoading(false);
                navigate("/"); // Redirect to home
                return { success: true, message: "Đăng nhập thành công" };
            } else {
                throw new Error(response.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            setError(error.message || "Đã xảy ra lỗi khi đăng nhập");
            setIsLoading(false);
            return { success: false, message: error.message || "Đăng nhập thất bại" };
        }
    };

    const logout = () => {
        // Clear cookies
        cookie.remove("token", { path: "/" });
        cookie.remove("userData", { path: "/" });

        // Clear user state
        userDispatch({ type: USER_ACTIONS.LOGOUT });

        // Clear any loading states and errors
        setIsLoading(false);
        setError(null);

        // Navigate to login page
        navigate("/login");
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        navigate,
        // User state
        user: userState.user,
        isAuthenticated: userState.isAuthenticated,
        isAuthLoading,
        isLoading,
        setIsLoading,
        error,
        // Auth functions
        login,
        logout,
        clearError,
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };