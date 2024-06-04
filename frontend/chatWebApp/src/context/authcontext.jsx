import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import useHistory instead of useNavigate

import {
  InitSocket,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/index.js";
import Loader from "../components/Loader.jsx";
import { LocalStorage, requestHandler } from "../utils/index.js";
import axios from "axios";

// Create a context to manage authentication-related data and functions
const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // const history = useHistory();
  const navigate = useNavigate(); // Use useHistory instead of useNavigate
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 120000,
  });

  const login = async (data) => {
    setIsLoading(true);
    console.log("Login: Loading started");
    try {
      const res = await apiClient.post("/users/login", data);
      const responseData = res.data;
    
      if (responseData?.success) {
        console.log(`respons data is ${responseData?.data.user}`);
        const { user, accessToken } = responseData.data;
        setUser(user);
        setToken(accessToken);
        console.log(
          `after successfull login token is ${token} and user is ${user}`
        );
        LocalStorage.set("user", user);
        LocalStorage.set("token", accessToken);
        console.log("User login successful, initializing socket...");
        await requestHandler(
          async () => await InitSocket(),
          setIsLoading,
          () => {
            console.log("Socket initialized, navigating to chat...");
            navigate("/chat");
            // history.push("/chat");
          },
          (error) => {
            console.error("Login: Error during socket initialization", error);
            alert(error);
          }
        );
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log("error occour during login", error);
      if ([401, 403].includes(error?.response?.data?.statusCode)) {
        localStorage.clear(); // Clear local storage on authentication issues
        if (typeof window !== "undefined") {
          console.log("inside window is not undefined true");
          window.location.href = "/login"; // Redirect to login page
        }
      } else {
        alert("Something went wrong at the time of login");
      }
    } finally {
      setIsLoading(false);
      console.log("Login loading finished");
    }
  };

  // Function to handle user registration
  const register = async (data) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        // history.push("/login");
        alert("Account created successfully! Go ahead and login.");
        navigate("/login");

        // Navigate to "/login" after successful registration using history.push
      },
      alert
      // Display error alerts on request failure
    );
  };

  // Function to handle user logout
  const logout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        LocalStorage.clear(); // Clear local storage on logout
        // history.push("/login"); // Navigate to "/login" after successful logout using history.push
        navigate("/login");
      },
      alert // Display error alerts on request failure
    );
  };

  // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = LocalStorage.get("token");
    const _user = LocalStorage.get("user");
    if (_token && _user?._id) {
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);

  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { AuthContext, AuthProvider, useAuth };
