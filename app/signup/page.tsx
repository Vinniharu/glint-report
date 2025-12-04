"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import { api, RegisterPayload } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterPayload>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        username: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await api.auth.register(formData);
            toast.success("Registration successful");
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white text-black">
            {/* Left Side - Branding/Logo */}
            <div className="hidden lg:flex flex-col items-center justify-center p-10 bg-blue-600 h-screen sticky top-0">
                <div className="absolute inset-0 pointer-events-none opacity-20" />
                <div className="relative z-10 flex flex-col items-center">
                    <img
                        src="/eib.png"
                        alt="Company Logo"
                        className="h-84 w-84 object-contain"
                    />
                </div>
            </div>

            {/* Right Side - Registration Form (Scrollable) */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-y-auto h-screen">
                <div className="w-full max-w-lg space-y-8 py-10">
                    <div className="text-center lg:text-left">
                        <h2 className={cn("text-2xl font-bold tracking-tight", geistMono.className)}>
                            Create Account
                        </h2>
                        <p className="text-black mt-2">
                            Enter your details to register for access.
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="first_name"
                                    className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                                >
                                    First Name
                                </label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ada"
                                    className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="last_name"
                                    className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                                >
                                    Last Name
                                </label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Lovelace"
                                    className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ada@example.com"
                                    className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="phone"
                                    className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                                >
                                    Phone
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+15556667777"
                                    className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                            >
                                Username (Optional)
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="ada.l"
                                className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="border-gray-200 text-black placeholder:text-black focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all h-11"
                            />
                        </div>

                        {error && (
                            <div className="p-3 border border-red-900/50 bg-red-900/10 text-red-400 text-sm rounded-md">
                                <span className="font-mono mr-2">[ERROR]</span>
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white hover:opacity-90 font-medium h-11 rounded-none border border-transparent hover:border-blue-600 transition-all"
                        >
                            {isLoading ? (
                                <span className={geistMono.className}>REGISTERING...</span>
                            ) : (
                                <span className={geistMono.className}>CONFIRM REGISTRATION</span>
                            )}
                        </Button>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push("/")}
                                className="text-black hover:text-black hover:bg-transparent"
                            >
                                <span className={cn("text-xs", geistMono.className)}>ALREADY HAVE AN ACCOUNT? LOGIN</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
