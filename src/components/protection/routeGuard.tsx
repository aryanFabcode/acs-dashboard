"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@reduxjs/toolkit/query";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token } = useSelector((state: RootState) => state.auth);
    const isPublicRoute = ["/signin", "/signup"].includes(pathname);

    useEffect(() => {
        if (!token && !isPublicRoute) {
            router.push("/signin");
        }
        if (token && isPublicRoute) {
            router.push("/");
        }
    }, [token, isPublicRoute, router]);

    return <>{children}</>;
}
