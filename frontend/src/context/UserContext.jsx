// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("usuario");

      if (saved && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } else {
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("usuario");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
