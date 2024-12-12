"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Spin } from "antd";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(false);

  const isDashboardPath = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboardPath && !isAuthenticated && !isChecking) {
      setIsChecking(true);
      checkAuth()
        .catch(() => {
          router.push("/login");
        })
        .finally(() => {
          setIsChecking(false);
        });
    }
  }, [isAuthenticated, isDashboardPath, isChecking]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isDashboardPath && !isAuthenticated && !isChecking) {
    return null;
  }

  return <>{children}</>;
}
