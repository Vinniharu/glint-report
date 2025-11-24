"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function DashboardPage() {
    const [reportCount, setReportCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const reports = await api.reports.list();
                setReportCount(reports.length);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setReportCount(0);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-4 rounded-full bg-gray-900/50 border border-gray-800 animate-pulse">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
            </div>

            <div>
                <h1 className={cn("text-4xl font-bold tracking-tighter text-white mb-4", geistMono.className)}>
                    WELCOME TO GLINT
                </h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    System operational. Select a module from the sidebar to begin.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
                <div className="p-6 border border-gray-800 bg-gray-900/20 rounded-lg">
                    <div className={cn("text-2xl font-bold text-white mb-1", geistMono.className)}>99.9%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Uptime</div>
                </div>
                <div className="p-6 border border-gray-800 bg-gray-900/20 rounded-lg">
                    <div className={cn("text-2xl font-bold text-white mb-1", geistMono.className)}>
                        {reportCount !== null ? reportCount : "-"}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Total Reports</div>
                </div>
                <div className="p-6 border border-gray-800 bg-gray-900/20 rounded-lg">
                    <div className={cn("text-2xl font-bold text-white mb-1", geistMono.className)}>SECURE</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Network</div>
                </div>
            </div>
        </div>
    );
}
