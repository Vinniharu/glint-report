"use client";

import { Report } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { FileText, Link as LinkIcon, Image as ImageIcon, Video } from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface ViewReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
}

export function ViewReportModal({ isOpen, onClose, report }: ViewReportModalProps) {
    if (!report) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="REPORT DETAILS"
            description={`ID: ${report.id}`}
            className="max-w-3xl bg-black border border-gray-800 text-white"
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Title</label>
                    <div className="text-xl font-bold">{report.title}</div>
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Summary</label>
                    <div className="text-gray-300">{report.body}</div>
                </div>

                {/* Content Blocks */}
                {report.content && report.content.length > 0 && (
                    <div className="space-y-2 border-t border-gray-800 pt-4">
                        <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Task List</label>
                        <div className="space-y-4">
                            {report.content.map((block, index) => (
                                <div key={index} className="bg-gray-900/30 p-4 rounded border border-gray-800">
                                    {block.label && (
                                        <div className={cn("text-xs text-blue-400 mb-2 uppercase", geistMono.className)}>{block.label}</div>
                                    )}
                                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                        {block.value?.markdown || JSON.stringify(block.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attachments */}
                {report.attachments && report.attachments.length > 0 && (
                    <div className="space-y-2 border-t border-gray-800 pt-4">
                        <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Attachments</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {report.attachments.map((att, index) => {
                                let Icon = FileText;
                                if (att.type === "image") Icon = ImageIcon;
                                if (att.type === "video") Icon = Video;
                                if (att.type === "link") Icon = LinkIcon;

                                return (
                                    <a
                                        key={index}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded hover:bg-gray-800 transition-colors group"
                                    >
                                        <div className="p-2 bg-black rounded border border-gray-800 group-hover:border-gray-600">
                                            <Icon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-300 group-hover:text-white truncate">{att.name}</div>
                                            <div className="text-xs text-gray-600 group-hover:text-gray-500 truncate">{att.type}</div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-800">
                    <Button onClick={onClose} className="bg-white text-black hover:bg-gray-200">
                        CLOSE
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
