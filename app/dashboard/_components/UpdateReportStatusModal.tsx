"use client";

import { useState } from "react";
import { Report, DgmDecisionPayload, UserRole } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface UpdateReportStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
    onSubmit: (reportId: string, data: DgmDecisionPayload, isGM: boolean) => Promise<void>;
    userRole: UserRole | null;
}

export function UpdateReportStatusModal({ isOpen, onClose, report, onSubmit, userRole }: UpdateReportStatusModalProps) {
    const [action, setAction] = useState<"approve" | "request_changes" | "needs_revision">("approve");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isGM = userRole === "general_manager";
    const isDGM = userRole === "deputy_general_manager";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!report) return;

        // Validate comment requirement
        if ((action === "request_changes" || action === "needs_revision") && !comment.trim()) {
            setError("Comment is required when requesting changes or revisions");
            return;
        }

        // Validate report status based on role
        if (isDGM && !["submitted", "needs_revision"].includes(report.status)) {
            setError("DGM can only review reports with status 'submitted' or 'needs_revision'");
            return;
        }

        if (isGM && !["dgm_approved", "gm_approved"].includes(report.status)) {
            setError("GM can only review reports with status 'dgm_approved' or 'gm_approved'");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            const payload: DgmDecisionPayload = {
                action,
                ...(comment.trim() && { comment: comment.trim() }),
            };
            await onSubmit(report.id, payload, isGM);
            onClose();
            // Reset form
            setAction("approve");
            setComment("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update report status");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!report) return null;

    const modalTitle = isGM ? "GM DECISION" : "DGM DECISION";
    const roleLabel = isGM ? "General Manager" : "Deputy General Manager";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            description={`${roleLabel} review for "${report.title}".`}
            className="max-w-md bg-black border border-gray-800 text-white"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>
                        Current Status
                    </label>
                    <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-md">
                        <span className="text-white font-mono text-sm uppercase">{report.status}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>
                        Action
                    </label>
                    <Select
                        value={action}
                        onChange={(e) => setAction(e.target.value as typeof action)}
                        options={[
                            { label: "Approve", value: "approve" },
                            { label: "Request Changes", value: "request_changes" },
                            { label: "Needs Revision", value: "needs_revision" },
                        ]}
                        className="bg-black border-gray-800 text-white"
                    />
                </div>

                {(action === "request_changes" || action === "needs_revision") && (
                    <div className="space-y-2">
                        <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>
                            Comment <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Provide detailed feedback..."
                            rows={4}
                            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                )}

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md">
                        <span className="font-mono mr-2">[ERROR]</span>
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-gray-900">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-white text-black hover:bg-gray-200">
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT DECISION"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
