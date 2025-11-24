"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, User, LogOut, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (token) {
                    const userData = await api.auth.me(token);
                    setUserRole(userData.role as string);
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        };
        fetchUserRole();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        router.push("/");
    };

    const baseLinks = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/reports", label: "All Reports", icon: FileText },
        { href: "/dashboard/reports/create", label: "Create Report", icon: Plus },
    ];

    const adminLinks = [
        { href: "/dashboard/users", label: "User Management", icon: Users },
    ];

    const profileLinks = [
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ];

    const links = [
        ...baseLinks,
        ...(userRole === "admin" ? adminLinks : []),
        ...profileLinks,
    ];

    return (
        <div className="w-64 border-r border-gray-800 bg-black flex flex-col h-full">
            <div className="p-6 border-b border-gray-800">
                <h1 className={cn("text-xl font-bold tracking-tighter text-white", geistMono.className)}>
                    GLINT REPORT
                </h1>
                <p className="text-xs text-gray-500 mt-1">SYSTEM V1.0</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-white text-black"
                                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className={geistMono.className}>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950/20"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className={geistMono.className}>LOGOUT</span>
                </Button>
            </div>
        </div>
    );
}
