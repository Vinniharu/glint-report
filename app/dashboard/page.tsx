"use client";

import { useEffect, useState } from "react";
import { api, User } from "@/lib/api";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function DashboardPage() {
    const [reportCount, setReportCount] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [chartData, setChartData] = useState<{
        statusDistribution: { name: string; value: number }[];
        reportsOverTime: { date: string; count: number }[];
    } | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const reports = await api.reports.list();
                setReportCount(reports?.length ?? 0);

                // Process data for charts
                if (reports) {
                    // Status Distribution
                    const statusCounts: Record<string, number> = {};
                    reports.forEach(r => {
                        const status = r.status || "unknown";
                        statusCounts[status] = (statusCounts[status] || 0) + 1;
                    });
                    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
                        name: name.replace(/_/g, " ").toUpperCase(),
                        value
                    }));

                    // Reports Over Time (Last 7 days or grouped by date)
                    const dateCounts: Record<string, number> = {};
                    reports.forEach(r => {
                        if (r.created_at) {
                            const date = new Date(r.created_at).toLocaleDateString();
                            dateCounts[date] = (dateCounts[date] || 0) + 1;
                        }
                    });
                    // Sort by date
                    const reportsOverTime = Object.entries(dateCounts)
                        .map(([date, count]) => ({ date, count }))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(-7); // Last 7 entries

                    setChartData({ statusDistribution, reportsOverTime });
                }

            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setReportCount(0);
            }
        };

        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from session storage", e);
            }
        }

        fetchStats();
    }, []);

    // Colors for Pie Chart - using theme variables would be tricky directly in recharts fill, 
    // so we use a palette that looks good. 
    // Ideally we would read computed styles, but for simplicity we use a set of standard colors.
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="flex flex-col h-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={cn("text-3xl font-bold tracking-tighter mb-1 text-(--theme-foreground)", geistMono.className)}>
                        DASHBOARD
                    </h1>
                    <p className="text-(--theme-muted) text-sm">
                        Welcome back, <span className="font-mono text-(--theme-foreground)">{user?.first_name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full border border-(--theme-border) bg-(--theme-secondary) text-xs font-mono text-(--theme-foreground)">
                        {new Date().toLocaleDateString()}
                    </div>
                    <div className="px-3 py-1 rounded-full border border-(--theme-border) bg-(--theme-secondary) text-xs font-mono uppercase text-(--theme-muted)">
                        {user?.subsidiary || "HEADQUARTERS"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border border-(--theme-border) bg-(--theme-secondary)">
                    <div className="text-(--theme-muted) text-xs uppercase tracking-wider mb-2">Total Reports</div>
                    <div className={cn("text-3xl font-bold text-(--theme-foreground)", geistMono.className)}>
                        {reportCount !== null ? reportCount : "-"}
                    </div>
                </div>
                <div className="p-6 rounded-lg border border-(--theme-border) bg-(--theme-secondary)">
                    <div className="text-(--theme-muted) text-xs uppercase tracking-wider mb-2">Pending Review</div>
                    <div className={cn("text-3xl font-bold text-(--theme-foreground)", geistMono.className)}>
                        {chartData?.statusDistribution.find(s => s.name === "SUBMITTED")?.value || 0}
                    </div>
                </div>
                <div className="p-6 rounded-lg border border-(--theme-border) bg-(--theme-secondary)">
                    <div className="text-(--theme-muted) text-xs uppercase tracking-wider mb-2">Approved</div>
                    <div className={cn("text-3xl font-bold text-(--theme-foreground)", geistMono.className)}>
                        {(chartData?.statusDistribution.find(s => s.name.includes("APPROVED"))?.value || 0)}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Pie Chart */}
                <div className="p-6 rounded-lg border border-(--theme-border) bg-(--theme-secondary) flex flex-col">
                    <h3 className={cn("text-sm uppercase tracking-wider text-(--theme-muted) mb-6", geistMono.className)}>
                        Status Distribution
                    </h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData?.statusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData?.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--theme-background)" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--theme-background)',
                                        borderColor: 'var(--theme-border)',
                                        color: 'var(--theme-foreground)'
                                    }}
                                    itemStyle={{ color: 'var(--theme-foreground)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {chartData?.statusDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs text-(--theme-muted)">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
