"use client";

import { PATHS, PROTECTED_PATHS, PUBLIC_PATHS } from "@/constants/routes";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );
}

function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some(
    (protectedPath) => path === protectedPath || path.startsWith(protectedPath + "/")
  );
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { account, isLoading } = useWallet();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (account && isPublicPath(pathname)) {
      const callback = new URLSearchParams(window.location.search).get("callback");
      router.replace(callback ?? PATHS.DASHBOARD);
    }
    if (!account && isProtectedPath(pathname)) {
      router.replace(`${PATHS.LANDING_PAGE}?callback=${encodeURIComponent(pathname)}`);
    }
  }, [account, isLoading, pathname, router]);

  return <>{children}</>;
}

export default RouteGuard;
