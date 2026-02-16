"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Success - redirect based on role
      const { role } = data.user;
      if (role === "super-admin") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 mb-4 animate-bounce">
            <FiShield size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Online Planet
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            E-Commerce Analytics SaaS
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-black text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-shake">
              <FiAlertCircle className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-tight">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Demo Access Credentials
            </p>
            <div className="grid grid-cols-1 gap-2 text-[10px] font-bold text-gray-500 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <span className="text-indigo-600 block mb-1">Super Admin (Full Access)</span>
                <p>U: harshurao058@gmail.com</p>
                <p>P: Harsh@7233</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <span className="text-blue-600 block mb-1">Growth Tier User</span>
                <p>U: growth_user@example.com</p>
                <p>P: password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <span className="text-purple-600 block mb-1">Starter Tier User</span>
                <p>U: starter_user@example.com</p>
                <p>P: password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <span className="text-green-600 block mb-1">Free Tier User</span>
                <p>U: free_user@example.com</p>
                <p>P: password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <span className="text-red-600 block mb-1">Expired Subscription</span>
                <p>U: expired_user@example.com</p>
                <p>P: password123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 font-medium text-xs">
          Built with ❤️ for Online Planet Dubai
        </p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
