'use client'

import { isLoggedIn } from "@/api/authToken";
import Loader from "@/components/common/Loader";
import UserFooter from "@/components/user/UserFooter";
import UserHeader from "@/components/user/UserHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (window.location.pathname.startsWith("/user/signin")) {
      setCheckingAuth(false);
      return;
    }

    if (!isLoggedIn()) {
      const currentUrl =
        window.location.pathname + window.location.search;

      router.replace(
        `/user/signin?returnUrl=${encodeURIComponent(currentUrl)}`
      );
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">
        {children}</main>
      <UserFooter />
    </div>
  );
}
