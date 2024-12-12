"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { JWT } from "@/constants";
import { message } from "antd";
import { authService } from "@/services/auth";
import { MenuItem } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  logout: () => void;
  checkAuth: () => Promise<void>;
  menuInfo: MenuItem[];
  resourceInfo: any[];
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: () => {},
  checkAuth: async () => {},
  menuInfo: [],
  resourceInfo: [],
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [menuInfo, setMenuInfo] = useState<MenuItem[]>([]);
  const [resourceInfo, setResourceInfo] = useState<any[]>([]);
  const router = useRouter();
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(JWT);
      if (!token) {
        return;
      }
      const { userInfo, menus, resources } =
        await authService.checkLoginStatus();
      if (userInfo) {
        setIsAuthenticated(true);
        setUser(userInfo);
        setMenuInfo(menus);
        setResourceInfo(resources);
      }
    } catch (error) {
      localStorage.removeItem(JWT);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(JWT);
    setIsAuthenticated(false);
    setUser(null);
    message.success("已退出登录");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        menuInfo,
        resourceInfo,
        user,
        logout: handleLogout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
