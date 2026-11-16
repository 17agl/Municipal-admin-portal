import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SETTINGS } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ecosort_municipal_auth");
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS.adminProfile;
    } catch {
      return INITIAL_SETTINGS.adminProfile;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("ecosort_municipal_auth") || true); // default logged in for dev convenience
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem("ecosort_municipal_auth", JSON.stringify(adminUser));
    } else {
      localStorage.removeItem("ecosort_municipal_auth");
    }
  }, [adminUser]);

  const login = (email, password) => {
    // Demo municipal admin authentication
    const user = {
      ...INITIAL_SETTINGS.adminProfile,
      email: email || INITIAL_SETTINGS.adminProfile.email,
      lastLogin: new Date().toISOString()
    };
    setAdminUser(user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ adminUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
