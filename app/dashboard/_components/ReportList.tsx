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
import { Eye } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface ReportListProps {
    reports: Report[];
    isLoading?: boolean;
    onView?: (report: Report) => void;
}

export function ReportList({ reports, isLoading, onView }: ReportListProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">LOADING SYSTEM DATA...</div>;
    }

    if (reports.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-md bg-gray-900/50">
                NO REPORTS FOUND IN DATABASE.
            </div>
        );
    }

    return (
        <div className="border border-gray-800 rounded-md overflow-hidden">
            <Table className="bg-black">
                <TableHeader className="bg-gray-900/50">
                    <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Title</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Summary</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Created At</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider text-right", geistMono.className)}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id} className="border-gray-800 hover:bg-gray-900/30 transition-colors">
                            <TableCell className="font-medium text-white">{report.title}</TableCell>
                            <TableCell className="text-gray-500 truncate max-w-xs">
                                {report.body}
                            </TableCell>
                            <TableCell className="text-gray-500 font-mono text-xs">
                                {new Date(report.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onView?.(report)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    VIEW
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
