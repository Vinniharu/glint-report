"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const data = await api.auth.me(token);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">LOADING USER DATA...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">FAILED TO LOAD PROFILE</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                <div className="h-16 w-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                    <h1 className={cn("text-2xl font-bold tracking-tighter text-white", geistMono.className)}>
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-gray-500 text-sm font-mono">@{user.username}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="space-y-4">
                    <h2 className={cn("text-sm uppercase tracking-widest text-gray-500", geistMono.className)}>
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-900/20 border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">EMAIL</div>
                            <div className="text-white font-mono text-sm">{user.email}</div>
                        </div>
                        <div className="p-4 bg-gray-900/20 border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">PHONE</div>
                            <div className="text-white font-mono text-sm">{user.phone}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className={cn("text-sm uppercase tracking-widest text-gray-500", geistMono.className)}>
                        System Role
                    </h2>
                    <div className="p-4 bg-gray-900/20 border border-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">CURRENT ASSIGNMENT</div>
                        <div className="text-white font-mono text-sm uppercase">{user.role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
