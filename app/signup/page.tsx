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
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white selection:bg-blue-500/30 py-10">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative w-full max-w-lg p-8">
                <div className="mb-8 text-center">
                    <h1 className={cn("text-3xl font-bold tracking-tighter mb-2", geistMono.className)}>
                        NEW DEVELOPER REGISTRATION
                    </h1>
                    <p className="text-gray-500 text-sm">Create credentials to access the system.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="first_name"
                                className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                                className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="last_name"
                                className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                                className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                                className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                                className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                            className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
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
                            className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
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
                        className="w-full bg-white text-black hover:bg-gray-200 font-medium h-11 rounded-none border border-transparent hover:border-gray-400 transition-all"
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
                            className="text-gray-500 hover:text-white hover:bg-transparent"
                        >
                            <span className={cn("text-xs", geistMono.className)}>ALREADY HAVE AN ACCOUNT? LOGIN</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
