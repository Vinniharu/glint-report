"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
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
      console.log(user);
      toast.success("Welcome My Nigga");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white selection:bg-blue-500/30">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className={cn("text-3xl font-bold tracking-tighter mb-2", geistMono.className)}>
            GLINT REPORT SYSTEM
          </h1>
          <p className="text-gray-500 text-sm">Enter credentials to authenticate.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className={cn("text-xs uppercase tracking-widest text-gray-500", geistMono.className)}
              >
                Identifier
              </label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="username or email"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-black border-gray-800 text-white placeholder:text-gray-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>
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
              <span className={geistMono.className}>AUTHENTICATING...</span>
            ) : (
              <span className={geistMono.className}>INITIALIZE SESSION</span>
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/signup")}
            className="text-gray-500 hover:text-white hover:bg-transparent"
          >
            <span className={cn("text-xs", geistMono.className)}>DON'T HAVE AN ACCOUNT? SIGNUP</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
