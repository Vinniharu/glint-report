"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const isPublicPath = PUBLIC_PATHS.includes(pathname);

        if (!token && !isPublicPath) {
            router.push("/");
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router]);

    // Prevent flashing of protected content before redirect
    if (!isAuthorized && !PUBLIC_PATHS.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
