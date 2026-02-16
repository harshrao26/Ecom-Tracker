"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface RazorpayButtonProps {
  plan: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  onSuccess?: () => void;
  onFailure?: (error: string) => void;
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({
  plan,
  billingCycle,
  amount,
  onSuccess,
  onFailure,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== "undefined") {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      // Open Razorpay popup
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Online Planet",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
        order_id: data.orderId,
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/dashboard?payment=success");
              }
            } else {
              throw new Error(
                verifyData.error || "Payment verification failed",
              );
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            if (onFailure) {
              onFailure(error.message);
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (onFailure) {
              onFailure("Payment cancelled");
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      setLoading(false);
      if (onFailure) {
        onFailure(error.message);
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Processing...
        </>
      ) : (
        <>Pay ₹{amount.toLocaleString()}</>
      )}
    </button>
  );
}
