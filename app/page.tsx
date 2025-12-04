"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

import { useTheme } from "@/components/ThemeProvider";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await api.auth.login({ identifier, password });
      sessionStorage.setItem("token", user.token);
      // Store user info for theming
      if (user.user) {
        sessionStorage.setItem("user", JSON.stringify({...user.user }));
        // Trigger theme update via context
        setTheme((user.user as any).subsidiary);
        // setTheme("greenenergy");
      }
      toast.success("Welcome My Nigga");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white text-black">
      {/* Left Side - Branding/Logo */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-10 bg-blue-600">
        <div className="absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/eib.png"
            alt="Company Logo"
            className="h-84 w-84 object-contain"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className={cn("text-2xl font-bold tracking-tight", geistMono.className)}>
              Welcome Back
            </h2>
            <p className="text-black mt-2">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className={cn("text-xs uppercase tracking-widest text-black", geistMono.className)}
              >
                Email or Username
              </label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="name@example.com"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <span className={geistMono.className}>AUTHENTICATING...</span>
              ) : (
                <span className={geistMono.className}>ACCESS SYSTEM</span>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/signup")}
                className="text-black hover:text-black hover:bg-transparent"
              >
                <span className={cn("text-xs", geistMono.className)}>NEW USER? REGISTER HERE</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
