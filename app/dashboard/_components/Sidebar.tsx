"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, User, LogOut, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

import { useTheme } from "@/components/ThemeProvider";
import { SUBSIDIARIES } from "@/lib/subsidiaryColors";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme } = useTheme();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [subsidiary, setSubsidiary] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (token) {
                    const userData = await api.auth.me(token);
                    setUserRole(userData.role as string);
                    // Also get subsidiary from user data if available, or rely on what's in session storage
                    // The theme provider handles the visual theme, but we need the name/logo here.
                    // We can try to match the current theme back to a subsidiary, or just read the user object again.
                    const userStr = sessionStorage.getItem("user");
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        setSubsidiary(user.subsidiary);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        };
        fetchUserRole();
    }, []);

    const currentSubsidiary = SUBSIDIARIES.find(s => s.id === (subsidiary?.toLowerCase().replace(/\s+/g, "") || "default")) || SUBSIDIARIES[0];

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
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
        <div className="w-64 border-r border-(--theme-border) bg-(--theme-background) flex flex-col h-full">
            <div className="p-6 border-b border-(--theme-border)">
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src={currentSubsidiary.logo}
                        alt={`${currentSubsidiary.name} Logo`}
                        className="h-8 w-8 object-contain"
                    />
                    <h1 className={cn("text-lg font-bold tracking-tighter text-(--theme-foreground)", geistMono.className)}>
                        {currentSubsidiary.name.toUpperCase()}
                    </h1>
                </div>
                <p className="text-xs text-(--theme-muted)">REPORT SYSTEM V1.0</p>
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
                                    ? "bg-(--theme-foreground) text-(--theme-background)"
                                    : "text-(--theme-muted) hover:text-(--theme-foreground) hover:bg-(--theme-secondary)"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className={geistMono.className}>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-(--theme-border)">
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
