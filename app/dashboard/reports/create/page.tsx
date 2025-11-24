"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ReportForm } from "../../_components/ReportForm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function CreateReportPage() {
    const router = useRouter();

    const handleSubmit = async (data: FormData) => {
        await api.reports.create(data);
        router.push("/dashboard/reports");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className={cn("text-3xl font-bold tracking-tighter text-white", geistMono.className)}>
                    CREATE REPORT
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Compile a new system report.
                </p>
            </div>

            <div className="bg-gray-900/20 border border-gray-800 p-6 rounded-lg">
                <ReportForm onSubmit={handleSubmit} onCancel={() => router.back()} />
            </div>
        </div>
    );
}
