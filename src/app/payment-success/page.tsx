"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  FiCheck,
  FiArrowRight,
  FiDownload,
  FiHome,
  FiCreditCard,
} from "react-icons/fi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const plan = searchParams.get("plan") || "Growth";
  const amount = searchParams.get("amount") || "2,499";

  useEffect(() => {
    setMounted(true);
    // Fire confetti burst
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-500/10 border border-gray-100 p-10 text-center relative overflow-hidden">
          {/* Animated Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-200 mb-8 relative z-10"
          >
            <FiCheck size={48} strokeWidth={3} />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-green-500 rounded-full -z-10"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-gray-900 tracking-tight mb-2"
          >
            Payment Success!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 font-medium mb-10"
          >
            Your account is now upgraded to the{" "}
            <span className="text-indigo-600 font-black">{plan}</span> tier.
          </motion.p>

          {/* Dribbble Style Receipt Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 rounded-3xl p-6 text-left mb-10 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Order Details
              </span>
              <FiCreditCard className="text-gray-300" size={16} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-gray-500">Plan</span>
                <span className="text-sm font-black text-gray-900 capitalize">
                  {plan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-gray-500">
                  Amount Paid
                </span>
                <span className="text-sm font-black text-gray-900">
                  ₹{amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-green-600 uppercase">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Captured
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/dashboard"
              className="w-full bg-gray-900 text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              Go to Dashboard
              <FiArrowRight />
            </Link>
            <button className="w-full bg-white text-gray-900 border border-gray-100 rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">
              <FiDownload size={16} />
              Download Receipt
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
          >
            <FiHome size={14} />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
