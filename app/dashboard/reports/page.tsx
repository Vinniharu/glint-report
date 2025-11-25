"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, Report, DgmDecisionPayload, CreateReportPayload, UserRole } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ReportList } from "../_components/ReportList";
import { CreateReportModal } from "../_components/CreateReportModal";
import { ViewReportModal } from "../_components/ViewReportModal";
import { UpdateReportStatusModal } from "../_components/UpdateReportStatusModal";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const data = await api.reports.list();

            if (!data || !Array.isArray(data)) {
                setReports([]);
                return;
            }

            if (userRole === "general_manager") {
                const filteredReports = data.filter(report => report.status === "dgm_approved" || report.status === "gm_approved");
                setReports(filteredReports);
            } else if (userRole === "developer") {
                if (userId) {
                    const filteredReports = data.filter(report => report.developer_id === userId);
                    setReports(filteredReports);
                } else {
                    setReports([]);
                }
            } else {
                setReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            setReports([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (token) {
                    const userData = await api.auth.me(token);
                    setUserRole(userData.role as UserRole);
                    setUserId(userData.id as string);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userRole !== null) {
            fetchReports();
        }
    }, [userRole, userId]);

    const handleCreateReport = async (data: CreateReportPayload) => {
        await api.reports.create(data);
        await fetchReports(); // Refresh list
    };

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setIsViewModalOpen(true);
    };

    const handleStatusUpdate = (report: Report) => {
        setSelectedReport(report);
        setIsStatusModalOpen(true);
    };

    const handleSubmitStatusUpdate = async (reportId: string, data: DgmDecisionPayload, isGM: boolean) => {
        if (isGM) {
            await api.reports.gmDecision(reportId, data);
        } else {
            await api.reports.dgmDecision(reportId, data);
        }
        await fetchReports(); // Refresh list
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn("text-3xl font-bold tracking-tighter text-white", geistMono.className)}>
                        SYSTEM REPORTS
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Access and manage system status reports.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className={geistMono.className}>NEW REPORT</span>
                </Button>
            </div>

            <ReportList
                reports={reports}
                isLoading={isLoading}
                onView={handleViewReport}
                onStatusUpdate={handleStatusUpdate}
                userRole={userRole}
            />

            <CreateReportModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateReport}
            />

            <ViewReportModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                report={selectedReport}
            />

            <UpdateReportStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                report={selectedReport}
                onSubmit={handleSubmitStatusUpdate}
                userRole={userRole}
            />
        </div>
    );
}
