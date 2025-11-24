"use client";

import { useState } from "react";
import { CreateUserPayload, UserRole } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserPayload) => Promise<void>;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
    const [formData, setFormData] = useState<CreateUserPayload>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "developer",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
            // Reset form
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                username: "",
                password: "",
                role: "developer",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="REGISTER NEW USER"
            description="Create a new system user account."
            className="max-w-md bg-black border border-gray-800 text-white"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>First Name</label>
                        <Input name="first_name" value={formData.first_name} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Last Name</label>
                        <Input name="last_name" value={formData.last_name} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Phone</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Username</label>
                    <Input name="username" value={formData.username} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Password</label>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} required className="bg-black border-gray-800 text-white" />
                </div>

                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Role</label>
                    <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { label: "Developer", value: "developer" },
                            { label: "General Manager", value: "general_manager" },
                            { label: "Deputy General Manager", value: "deputy_general_manager" },
                            { label: "Admin", value: "admin" },
                        ]}
                        className="bg-black border-gray-800 text-white"
                    />
                </div>

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
                        {isSubmitting ? "PROCESSING..." : "CREATE USER"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
