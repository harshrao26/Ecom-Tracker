"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiCheckCircle, FiArrowLeft, FiShield } from "react-icons/fi";
import RazorpayButton from "@/components/payment/RazorpayButton";
import {
  getPlanDetails,
  getPlanPrice,
  type PlanType,
} from "@/lib/pricing.config";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [plan, setPlan] = useState<PlanType>("growth");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/checkout?plan=${plan}`);
    }

    // Get plan from URL
    const urlPlan = searchParams.get("plan");
    if (urlPlan && ["starter", "growth", "enterprise"].includes(urlPlan)) {
      setPlan(urlPlan as PlanType);
    }

    // Get billing cycle from URL
    const urlCycle = searchParams.get("cycle");
    if (urlCycle && ["monthly", "yearly"].includes(urlCycle)) {
      setBillingCycle(urlCycle as "monthly" | "yearly");
    }
  }, [status, router, searchParams, plan]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  const planDetails = getPlanDetails(plan);
  const amount = getPlanPrice(plan, billingCycle);
  const savings =
    billingCycle === "yearly" ? getPlanPrice(plan, "monthly") * 12 - amount : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold mb-6 transition-colors"
          >
            <FiArrowLeft />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <FiShield className="text-indigo-600" />
            Checkout
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Complete your purchase to unlock all features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {planDetails.name} Plan
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mt-1">
                    {billingCycle === "yearly"
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">
                    ₹{amount.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    /{billingCycle === "yearly" ? "year" : "month"}
                  </div>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all relative ${
                    billingCycle === "yearly"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Yearly
                  {savings > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      SAVE ₹{savings.toLocaleString()}
                    </span>
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
                  What's included
                </h3>
                <ul className="space-y-3">
                  {planDetails.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm font-medium text-gray-700"
                    >
                      <FiCheckCircle
                        className="text-indigo-600 mt-0.5 shrink-0"
                        size={18}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
              <FiShield className="text-blue-600" size={24} />
              <div>
                <h4 className="font-black text-blue-900 mb-1">
                  Secure Payment
                </h4>
                <p className="text-sm text-blue-700 font-medium">
                  Your payment is secured with 256-bit SSL encryption. We never
                  store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    {planDetails.name} Plan
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-green-600">
                      Annual Savings
                    </span>
                    <span className="font-bold text-green-600">
                      -₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="py-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-2">
                  {billingCycle === "yearly"
                    ? "Billed once per year"
                    : "Billed monthly"}
                </p>
              </div>

              {/* Payment Button */}
              <div className="mt-6">
                {paymentStatus === "success" ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="text-green-600" size={32} />
                    </div>
                    <p className="font-bold text-green-600">
                      Payment Successful!
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
                  </div>
                ) : paymentStatus === "error" ? (
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-red-50 rounded-xl">
                      <p className="font-bold text-red-600">Payment Failed</p>
                      <p className="text-sm text-red-500 mt-1">
                        {errorMessage}
                      </p>
                    </div>
                    <RazorpayButton
                      plan={plan}
                      billingCycle={billingCycle}
                      amount={amount}
                      onSuccess={() => setPaymentStatus("success")}
                      onFailure={(error) => {
                        setPaymentStatus("error");
                        setErrorMessage(error);
                      }}
                    />
                  </div>
                ) : (
                  <RazorpayButton
                    plan={plan}
                    billingCycle={billingCycle}
                    amount={amount}
                    onSuccess={() => setPaymentStatus("success")}
                    onFailure={(error) => {
                      setPaymentStatus("error");
                      setErrorMessage(error);
                    }}
                  />
                )}
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-4 font-medium">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
