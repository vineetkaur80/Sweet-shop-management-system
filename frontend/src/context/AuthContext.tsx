import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "../api/auth";

// 1. Extend User interface to handle potential JWT fields like 'exp'
interface User {
  id: string;
  role?: string;
  exp?: number; // Optional expiration time
}

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: Credentials) => Promise<void>;
  register: (data: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // <--- NEW: Expose loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // <--- NEW: Start as true

  const decodeUser = (token: string): User | null => {
    try {
      return jwtDecode<User>(token);
    } catch {
      return null;
    }
  };

  // 🔐 LOGIN
  const login = async (data: Credentials) => {
    try {
      const res = await loginUser(data);
      const token = res.data.token;

      localStorage.setItem("token", token);
      setUser(decodeUser(token));
    } catch (err) {
      throw new Error("Invalid credentials");
    }
  };

  // 📝 REGISTER
  const register = async (data: Credentials) => {
    try {
      await registerUser(data);
    } catch (err) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔄 RESTORE SESSION ON RELOAD
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeUser(token);

        // Optional: Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded && decoded.exp && decoded.exp < currentTime) {
          logout(); // Token expired
        } else {
          setUser(decoded); // Restore user
        }
      }
      setLoading(false); // <--- CRITICAL: Mark check as done
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading, // <--- Pass this to App
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
