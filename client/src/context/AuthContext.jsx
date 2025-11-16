import React, { createContext, useState, useContext, useEffect } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // const login = async (email, password) => {
  //   setLoading(true);
  //   try {
  //     const loggedInUser = await apiService.login(email, password);
  //     console.log("LOGIN RESPONSE IN REACT:", loggedInUser);
  //     if (loggedInUser) {
  //       setUser(loggedInUser);
  //       sessionStorage.setItem("user", JSON.stringify(loggedInUser));
  //       return loggedInUser;
  //     }
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const login = async (email, password) => {
  setLoading(true);
  try {
    const response = await apiService.login(email, password);

    // if backend returned "error", don't log in
    if (!response || response.error || response.status === "ERROR") {
      console.error("LOGIN FAILED:", response);
      return null;
    }

    console.log("LOGIN SUCCESS:", response);

    setUser(response);
    sessionStorage.setItem("user", JSON.stringify(response));
    return response;

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return null;
  } finally {
    setLoading(false);
  }
};


  const signup = async (userData) => {
    setLoading(true);
    try {
      const newUser = await apiService.signup(userData);
      if (newUser) {
        setUser(newUser);
        sessionStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
