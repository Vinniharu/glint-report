import { Report } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Eye, Paperclip, CheckCircle } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface ReportListProps {
    reports: Report[];
    isLoading?: boolean;
    onView?: (report: Report) => void;
    onStatusUpdate?: (report: Report) => void;
    userRole?: string | null;
}

function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case "submitted":
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "draft":
            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        case "approved":
        case "dgm_approved":
            return "bg-green-500/20 text-green-400 border-green-500/30";
        case "gm_approved":
            return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        case "rejected":
            return "bg-red-500/20 text-red-400 border-red-500/30";
        case "pending":
            return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        case "needs_revision":
            return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        default:
            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
}

function getStatusText(status: string) {
    switch (status?.toLowerCase()) {
        case "submitted":
            return "Submitted";
        case "draft":
            return "Draft";
        case "approved":
            return "Approved";
        case "dgm_approved":
            return "DGM Approved";
        case "gm_approved":
            return "GM Approved";
        case "rejected":
            return "Rejected";
        case "pending":
            return "Pending Review";
        case "needs_revision":
            return "Needs Revision";
        default:
            return status || "Unknown";
    }
}

export function ReportList({ reports, isLoading, onView, onStatusUpdate, userRole }: ReportListProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-(--theme-muted) animate-pulse">LOADING SYSTEM DATA...</div>;
    }

    if (reports.length === 0) {
        return (
            <div className="p-8 text-center text-(--theme-muted) border border-dashed border-(--theme-border) rounded-md bg-(--theme-secondary)">
                NO REPORTS FOUND IN DATABASE.
            </div>
        );
    }

    const isDeveloper = userRole === "developer";
    const isDGM = userRole === "deputy_general_manager";
    const isGM = userRole === "general_manager";
    const isAdmin = userRole === "admin";

    // Helper function to determine if status button should be shown
    const canUpdateStatus = (reportStatus: string) => {
        if (isDeveloper) return false;
        if (isDGM) return ["submitted", "needs_revision"].includes(reportStatus);
        if (isGM) return ["dgm_approved", "gm_approved"].includes(reportStatus);
        if (isAdmin) return true;
        return false;
    };

    return (
        <div className="border border-(--theme-border) rounded-md overflow-hidden">
            <Table className="bg-(--theme-background)">
                <TableHeader className="bg-(--theme-secondary)">
                    <TableRow className="border-(--theme-border) hover:bg-transparent">
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider", geistMono.className)}>Title</TableHead>
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider", geistMono.className)}>Status</TableHead>
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider", geistMono.className)}>Submitted At</TableHead>
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider", geistMono.className)}>Updated At</TableHead>
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider text-center", geistMono.className)}>Attachments</TableHead>
                        <TableHead className={cn("text-(--theme-muted) uppercase text-xs tracking-wider text-right", geistMono.className)}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id} className="border-(--theme-border) hover:bg-(--theme-secondary) transition-colors">
                            <TableCell className="font-medium text-(--theme-foreground)">{report.title}</TableCell>
                            <TableCell>
                                <span className={cn(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide",
                                    geistMono.className,
                                    getStatusColor(report.status)
                                )}>
                                    {getStatusText(report.status)}
                                </span>
                            </TableCell>
                            <TableCell className="text-(--theme-muted) font-mono text-xs">
                                {report.submitted_at
                                    ? new Date(report.submitted_at).toLocaleString()
                                    : "Not submitted"}
                            </TableCell>
                            <TableCell className="text-(--theme-muted) font-mono text-xs">
                                {new Date(report.updated_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                                {report.attachments && report.attachments.length > 0 ? (
                                    <div className="inline-flex items-center gap-1 text-(--theme-muted)">
                                        <Paperclip className="h-4 w-4" />
                                        <span className="text-xs font-mono">{report.attachments.length}</span>
                                    </div>
                                ) : (
                                    <span className="text-(--theme-muted) text-xs opacity-50">—</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView?.(report)}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        VIEW
                                    </Button>
                                    {canUpdateStatus(report.status) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onStatusUpdate?.(report)}
                                            className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            STATUS
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
