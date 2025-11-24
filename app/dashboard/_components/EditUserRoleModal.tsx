"use client";

import { useState, useEffect } from "react";
import { User, UserRole } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface EditUserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (userId: string, role: UserRole) => Promise<void>;
}

export function EditUserRoleModal({ isOpen, onClose, user, onSubmit }: EditUserRoleModalProps) {
    const [role, setRole] = useState<UserRole>("developer");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(user.id, role);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update role");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="UPDATE USER ROLE"
            description={`Modify access level for ${user.username}.`}
            className="max-w-sm bg-black border border-gray-800 text-white"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}>Role</label>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
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
                        {isSubmitting ? "UPDATING..." : "UPDATE ROLE"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
