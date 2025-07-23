import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true); //  Thêm loading

  useEffect(() => {
    const storedSessionId = localStorage.getItem("session_id");
    const storedUsername = localStorage.getItem("username");

    if (storedSessionId) setSessionId(storedSessionId);
    if (storedUsername) setUsername(storedUsername);

    setIsLoading(false); //  Đánh dấu load xong
  }, []);

  const login = (newSessionId, newUsername) => {
    localStorage.setItem("session_id", newSessionId);
    localStorage.setItem("username", newUsername);
    setSessionId(newSessionId);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem("session_id");
    localStorage.removeItem("username");
    setSessionId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ sessionId, username, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
