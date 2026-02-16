"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    // Verify email
    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "POST",
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === "loading" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50">
                <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 animate-bounce">
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
                <FiXCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-gray-900 mb-4">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified! ✅"}
            {status === "error" && "Verification Failed"}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          {status === "success" && (
            <p className="text-sm text-gray-500">
              Redirecting to login page in 3 seconds...
            </p>
          )}

          {status === "error" && (
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
