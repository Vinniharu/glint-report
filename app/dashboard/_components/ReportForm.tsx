"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { CreateReportPayload, ReportContentBlock, ReportAttachment } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface ReportFormProps {
    onSubmit: (data: CreateReportPayload) => Promise<void>;
    initialData?: CreateReportPayload;
    onCancel?: () => void;
}

const defaultData: CreateReportPayload = {
    title: "",
    body: "",
    content: [],
    attachments: []
};

export function ReportForm({ onSubmit, initialData = defaultData, onCancel }: ReportFormProps) {
    const [formData, setFormData] = useState<CreateReportPayload>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newContentText, setNewContentText] = useState("");
    const [newAttachment, setNewAttachment] = useState({
        type: "document" as ReportAttachment["type"],
        name: "",
        url: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addAttachment = () => {
        if (!newAttachment.name || !newAttachment.url) {
            setError("Attachment name and URL are required");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            attachments: [...(prev.attachments || []), { ...newAttachment }],
        }));
        setNewAttachment({ type: "document", name: "", url: "" });
        setError(null);
    };

    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index),
        }));
    };

    const addContentBlock = () => {
        if (!newContentText) return;
        const newBlock: ReportContentBlock = {
            type: "text",
            label: "Section",
            value: { markdown: newContentText },
        };
        setFormData((prev) => ({
            ...prev,
            content: [...(prev.content || []), newBlock],
        }));
        setNewContentText("");
    };

    const removeContentBlock = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            content: prev.content?.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-(--theme-muted)", geistMono.className)}>Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Weekly Platform Update"
                        className="bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) placeholder:text-(--theme-muted) focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-(--theme-muted)", geistMono.className)}>Summary</label>
                    <Input
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="Short plaintext summary."
                        className="bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) placeholder:text-(--theme-muted) focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                    />
                </div>
            </div>

            {/* Content Builder */}
            <div className="space-y-2 border-t border-(--theme-border) pt-4">
                <h3 className={cn("text-xs uppercase tracking-widest text-(--theme-muted) mb-2", geistMono.className)}>Task List</h3>
                <div className="space-y-2">
                    {formData.content?.map((block, index) => (
                        <div key={index} className="flex items-center justify-between bg-(--theme-secondary) border border-(--theme-border) p-2 rounded text-sm">
                            <span className="truncate flex-1 mr-2 text-(--theme-foreground)">
                                {block.value?.markdown || JSON.stringify(block.value)}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContentBlock(index)}
                                className="text-red-500 hover:text-red-400 h-6 w-6 p-0 hover:bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        value={newContentText}
                        onChange={(e) => setNewContentText(e.target.value)}
                        placeholder="Add text content..."
                        className="flex-1 bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) placeholder:text-(--theme-muted)"
                    />
                    <Button type="button" variant="secondary" onClick={addContentBlock} className="bg-(--theme-foreground) text-(--theme-background) hover:opacity-90">
                        Add Task
                    </Button>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2 border-t border-(--theme-border) pt-4">
                <h3 className={cn("text-xs uppercase tracking-widest text-(--theme-muted) mb-2", geistMono.className)}>Attachments</h3>
                <div className="space-y-2">
                    {formData.attachments?.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-(--theme-secondary) border border-(--theme-border) p-2 rounded text-sm">
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-(--theme-muted) uppercase">{attachment.type}</span>
                                    <span className="font-medium text-(--theme-foreground) truncate">{attachment.name}</span>
                                </div>
                                <span className="text-xs text-(--theme-muted) truncate">{attachment.url}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                                className="text-red-500 hover:text-red-400 h-6 w-6 p-0 hover:bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 p-3 border border-(--theme-border) rounded-md bg-(--theme-secondary)">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className={cn("text-xs uppercase tracking-widest text-(--theme-muted)", geistMono.className)}>Type</label>
                            <Select
                                value={newAttachment.type}
                                onChange={(e) => setNewAttachment({ ...newAttachment, type: e.target.value as ReportAttachment["type"] })}
                                options={[
                                    { label: "Document", value: "document" },
                                    { label: "Image", value: "image" },
                                    { label: "Video", value: "video" },
                                    { label: "Link", value: "link" },
                                    { label: "Attachment", value: "attachment" },
                                ]}
                                className="bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={cn("text-xs uppercase tracking-widest text-(--theme-muted)", geistMono.className)}>Name</label>
                            <Input
                                value={newAttachment.name}
                                onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
                                placeholder="Chart Q4"
                                className="bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) placeholder:text-(--theme-muted) text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={cn("text-xs uppercase tracking-widest text-(--theme-muted)", geistMono.className)}>URL</label>
                        <Input
                            value={newAttachment.url}
                            onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
                            placeholder="https://example.com/file.pdf"
                            className="bg-(--theme-background) border-(--theme-border) text-(--theme-foreground) placeholder:text-(--theme-muted) text-sm"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addAttachment}
                        className="w-full bg-(--theme-foreground) text-(--theme-background) hover:opacity-90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Attachment
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md">
                    <span className="font-mono mr-2">[ERROR]</span>
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-(--theme-border)">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} className="text-(--theme-muted) hover:text-(--theme-foreground) hover:bg-(--theme-secondary)">
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting} className="bg-(--theme-foreground) text-(--theme-background) hover:opacity-90">
                    {isSubmitting ? "PROCESSING..." : "SUBMIT REPORT"}
                </Button>
            </div>
        </form>
    );
}
