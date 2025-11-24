"use client";

import { User } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Edit } from "lucide-react";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"] });

interface UserListProps {
    users: User[];
    isLoading?: boolean;
    onEditRole: (user: User) => void;
}

export function UserList({ users, isLoading, onEditRole }: UserListProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">LOADING USER DATA...</div>;
    }

    if (users.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-md bg-gray-900/50">
                NO USERS FOUND.
            </div>
        );
    }

    return (
        <div className="border border-gray-800 rounded-md overflow-hidden">
            <Table className="bg-black">
                <TableHeader className="bg-gray-900/50">
                    <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Name</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Username</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Email</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Role</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider", geistMono.className)}>Created At</TableHead>
                        <TableHead className={cn("text-gray-400 uppercase text-xs tracking-wider text-right", geistMono.className)}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="border-gray-800 hover:bg-gray-900/30 transition-colors">
                            <TableCell className="font-medium text-white">{user.first_name} {user.last_name}</TableCell>
                            <TableCell className="text-gray-500">{user.username}</TableCell>
                            <TableCell className="text-gray-500">{user.email}</TableCell>
                            <TableCell className="text-gray-300">
                                <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs">
                                    {user.role.replace(/_/g, " ").toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell className="text-gray-500 font-mono text-xs">
                                {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditRole(user)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    ROLE
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
