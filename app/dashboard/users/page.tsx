"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, CreateUserPayload, User, UserRole } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { UserList } from "../_components/UserList";
import { CreateUserModal } from "../_components/CreateUserModal";
import { EditUserRoleModal } from "../_components/EditUserRoleModal";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await api.users.list();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (data: CreateUserPayload) => {
        await api.users.create(data);
        await fetchUsers();
    };

    const handleUpdateRole = async (userId: string, role: UserRole) => {
        await api.users.updateRole(userId, { role });
        await fetchUsers();
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn("text-3xl font-bold tracking-tighter text-white", geistMono.className)}>
                        USER MANAGEMENT
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Manage system access and user roles.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className={geistMono.className}>NEW USER</span>
                </Button>
            </div>

            <UserList
                users={users}
                isLoading={isLoading}
                onEditRole={setEditingUser}
            />

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateUser}
            />

            <EditUserRoleModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                user={editingUser}
                onSubmit={handleUpdateRole}
            />
        </div>
    );
}
