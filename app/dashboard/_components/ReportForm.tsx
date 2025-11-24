"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { CreateReportPayload, ReportContentBlock } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface ReportFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    initialData?: CreateReportPayload;
    onCancel?: () => void;
}

const defaultData: CreateReportPayload = {
    title: "",
    body: "",
    content: [],
    attachments: [],
};

export function ReportForm({ onSubmit, initialData = defaultData, onCancel }: ReportFormProps) {
    const [formData, setFormData] = useState<CreateReportPayload>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [newContentText, setNewContentText] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("body", formData.body || "");
            formDataToSend.append("content", JSON.stringify(formData.content || []));

            uploadedFiles.forEach((file) => {
                formDataToSend.append("attachments", file);
            });

            await onSubmit(formDataToSend);
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
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Weekly Platform Update"
                        className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Summary</label>
                    <Input
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="Short plaintext summary."
                        className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                    />
                </div>
            </div>

            {/* Content Builder */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
                <h3 className={cn("text-xs uppercase tracking-widest text-gray-500 mb-2", geistMono.className)}>Task List</h3>
                <div className="space-y-2">
                    {formData.content?.map((block, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-900/50 border border-gray-800 p-2 rounded text-sm">
                            <span className="truncate flex-1 mr-2 text-gray-300">
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
                        className="flex-1 bg-black border-gray-800 text-white placeholder:text-gray-700"
                    />
                    <Button type="button" variant="secondary" onClick={addContentBlock} className="bg-white text-black hover:bg-gray-200">
                        Add Text
                    </Button>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
                <h3 className={cn("text-xs uppercase tracking-widest text-gray-500 mb-2", geistMono.className)}>Attachments</h3>
                <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-900/50 border border-gray-800 p-2 rounded text-sm">
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-medium text-gray-300 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-400 h-6 w-6 p-0 hover:bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="file-upload"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full bg-white text-black hover:bg-gray-200"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md">
                    <span className="font-mono mr-2">[ERROR]</span>
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white hover:bg-gray-900">
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting} className="bg-white text-black hover:bg-gray-200">
                    {isSubmitting ? "PROCESSING..." : "SUBMIT REPORT"}
                </Button>
            </div>
        </form>
    );
}
