"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShoppingBag,
  FiBarChart2,
  FiLayers,
  FiShield,
  FiZap,
  FiGlobe,
  FiTrendingUp,
  FiPlay,
  FiPlus,
  FiMinus,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiGithub,
} from "react-icons/fi";
import { SiShopify, SiWoocommerce, SiAmazon, SiFlipkart } from "react-icons/si";

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm" : "bg-transparent py-6"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <FiShield size={22} />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            Online Planet
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <Link
            href="#features"
            className="hover:text-indigo-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#solutions"
            className="hover:text-indigo-600 transition-colors"
          >
            Solutions
          </Link>
          <Link
            href="#pricing"
            className="hover:text-indigo-600 transition-colors"
          >
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-indigo-600 transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

const SourceCard = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 min-w-[140px] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="text-2xl">{icon}</div>
    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

const IntegrationFlow = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-24 px-4 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative lg:px-10">
        {/* Left Side: Integration Sources */}
        <div className="flex flex-col gap-4 z-10 w-full md:w-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <SourceCard
              icon={<SiShopify className="text-[#96bf48]" />}
              label="Shopify"
            />
            <SourceCard
              icon={<SiWoocommerce className="text-[#96588a]" />}
              label="Woo"
            />
            <SourceCard
              icon={<SiAmazon className="text-[#FF9900]" />}
              label="Amazon"
            />
            <SourceCard
              icon={<SiFlipkart className="text-[#2874F0]" />}
              label="Flipkart"
            />
            <SourceCard
              icon={<FiTrendingUp className="text-indigo-600" />}
              label="Meta Ads"
            />
            <SourceCard
              icon={<FiGlobe className="text-blue-500" />}
              label="Marketing"
            />
          </div>
        </div>

        {/* Center: Online Planet Hub */}
        <div className="relative z-20 my-10 md:my-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-pulse relative">
            <FiShield size={48} className="relative z-10" />
            <div className="absolute inset-0 rounded-[32px] border-2 border-white/20 animate-ping opacity-20"></div>
          </div>
          <div className="absolute -inset-10 bg-indigo-500/10 blur-[60px] rounded-full -z-10"></div>
        </div>

        {/* Right Side: Output / Growth */}
        <div className="relative z-10 w-full md:w-auto">
          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl space-y-6 max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Impact
                </span>
                <span className="text-lg font-black text-gray-900 tracking-tight">
                  Business Growth
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-xs font-black tracking-tight flex items-center gap-1">
                <FiTrendingUp /> 150%
              </div>
            </div>

            {/* Miniature Bars */}
            <div className="flex items-end justify-between h-32 gap-3 px-2">
              {[35, 60, 45, 95, 65, 85].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-xl transition-all duration-1000 ${i % 2 === 0 ? "bg-indigo-100" : "bg-indigo-600 shadow-lg shadow-indigo-600/20"}`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>June 02</span>
              <span>June 23</span>
            </div>
          </div>

          {/* Floating Performance Tag */}
          <div className="absolute -top-10 -right-4 bg-gray-950 text-white p-5 rounded-[24px] shadow-2xl border border-gray-800 flex flex-col items-center animate-bounce-slow">
            <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mb-1">
              Increase Rate
            </span>
            <span className="text-2xl font-black">150% ↗</span>
          </div>
        </div>

        {/* Connecting Lines (SVG) - Hidden on mobile for performance and clarity */}
        <svg
          className="absolute inset-0 w-full h-full -z-10 hidden md:block"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
        >
          {/* Incoming Flows from Left */}
          {/* Top curve */}
          <path
            d="M220 150 C 400 150, 450 250, 500 250"
            stroke="url(#gradient-in)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow"
            fill="none"
          />
          {/* Bottom curve */}
          <path
            d="M220 350 C 400 350, 450 250, 500 250"
            stroke="url(#gradient-in)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow"
            fill="none"
          />
          {/* Middle straightish */}
          <path
            d="M220 250 L 500 250"
            stroke="url(#gradient-in)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow"
            fill="none"
          />

          {/* Outgoing Flow to Right */}
          <path
            d="M500 250 L 780 250"
            stroke="url(#gradient-out)"
            strokeWidth="4"
            strokeDasharray="8 8"
            className="animate-flow-output"
            fill="none"
          />

          <defs>
            <linearGradient id="gradient-in" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="gradient-out" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
    <div
      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}
    >
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

const PricingCard = ({
  title,
  price,
  description,
  features,
  highlighted,
  cta,
  planId,
  onSelect,
  isCurrentPlan,
  isExpired,
}: any) => {
  return (
    <div
      className={`relative p-8 rounded-[40px] flex flex-col transition-all duration-500 ${highlighted ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105 z-10" : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md"}`}
    >
      {highlighted && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Your Current Plan
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-lg font-black uppercase tracking-widest mb-1 opacity-80">
          {title}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black">₹{price}</span>
          <span className="text-sm font-bold opacity-60">/mo</span>
        </div>
        <p
          className={`mt-4 text-xs font-bold leading-relaxed ${highlighted ? "text-indigo-100" : "text-gray-500"}`}
        >
          {description}
        </p>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-xs font-bold">
            <FiCheckCircle
              className={`mt-0.5 shrink-0 ${highlighted ? "text-indigo-200" : "text-indigo-600"}`}
              size={16}
            />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(planId)}
        disabled={isCurrentPlan && !isExpired}
        className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center transition-all ${
          isCurrentPlan 
            ? "bg-green-50 text-green-600 border border-green-100 cursor-default" 
            : highlighted 
              ? "bg-white text-indigo-600 hover:bg-indigo-50" 
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200"
        }`}
      >
        {isCurrentPlan ? (isExpired ? "Renew Now" : "Active Plan") : cta}
      </button>
    </div>
  );
};

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
          {question}
        </span>
        {isOpen ? (
          <FiMinus className="text-indigo-600" />
        ) : (
          <FiPlus className="text-gray-400 group-hover:text-indigo-600" />
        )}
      </button>
      <div
        className={`mt-4 text-sm font-medium text-gray-500 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {answer}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Homepage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setCurrentPlan(data.user.subscription?.plan?.toLowerCase() || "free");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    checkSession();
  }, []);

  // Handle auto-checkout if plan and auto_checkout params are present
  useEffect(() => {
    const planId = searchParams.get("plan");
    const autoCheckout = searchParams.get("auto_checkout") === "true";

    if (planId && autoCheckout && user) {
      handlePayment(planId);
    }
  }, [searchParams, user]);

  const handlePayment = async (planId: string) => {
    if (!user) {
      router.push(`/signup?plan=${planId}&redirect=/&auto_checkout=true`);
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Online Planet",
        description: `${planId.toUpperCase()} Plan Subscription`,
        image: "https://onlineplanet.ae/logo.png",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(
              `/payment-success?plan=${planId}&amount=${verifyData.amount}`,
            );
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: data.user.mobile || "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#fcfcfd] selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-auto h-auto flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-yellow-500 text-xs">
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">
              The #1 AI Tool in 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            Grow your E-commerce <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
              sales with AI.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            See all your Shopify, Amazon, and Flipkart data in one simple
            dashboard. Track profits, automate GST, and get AI tips to grow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              href="/login"
              className="bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95 group"
            >
              Start Free Trial{" "}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-100 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm flex items-center gap-3 transition-all active:scale-95">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiPlay className="ml-1" size={12} />
              </div>
              Watch Demo
            </button>
          </div>

          <IntegrationFlow />
        </div>

        {/* Premium Background Layers */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-grid-white mask-fade-out opacity-20"></div>

          {/* Dotted Texture Illustration */}
          <div className="absolute inset-0 bg-dots-slate-200 mask-radial-dots opacity-30"></div>

          {/* Floating Illustrations / Shapes */}
          <div className="absolute top-[15%] right-[10%] w-64 h-64 border border-indigo-100 rounded-full opacity-20 animate-spin-slow -z-10">
            <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-indigo-400 rounded-full"></div>
          </div>
          <div
            className="absolute bottom-[25%] left-[5%] w-48 h-48 border border-purple-100 rounded-full opacity-10 animate-spin-slow -z-10"
            style={{ animationDirection: "reverse", animationDuration: "30s" }}
          >
            <div className="absolute bottom-0 right-1/2 -mr-1 w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[120px] rounded-full animate-float-slow"></div>
          <div
            className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[140px] rounded-full animate-float-slow"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-400/10 blur-[100px] rounded-full animate-float-slow"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </section>

      {/* --- Trusted By / Client Marquee --- */}
      <section className="py-20 border-y border-gray-50 bg-white/50 overflow-hidden group/marquee">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Trusted by Forward-Thinking Brands
          </p>
        </div>

        <div className="relative flex overflow-hidden pause-on-hover">
          <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 items-center py-4 will-change-transform">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  "/clients/bvwyc698yh5emfig9dmj.webp",
                  "/clients/image copy 2.png",
                  "/clients/image copy.png",
                  "/clients/image.png",
                  "/clients/oznfwdf1bpi0cxor3hth.png",
                  "/clients/ripacvxag9ovw0es15ub.webp",
                ].map((src, index) => (
                  <div
                    key={`${i}-${index}`}
                    className="flex-shrink-0 w-32 md:w-48 h-12 relative   transition-all duration-500"
                  >
                    <Image
                      src={src}
                      alt={`Client ${index}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 128px, 192px"
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* --- Bento Hub: Unified Command Center --- */}
      <section id="bento-hub" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Your entire empire. <br />
              <span className="text-indigo-600">
                One unified command center.
              </span>
            </h2>
            <p className="text-gray-500 font-bold max-w-xl mx-auto">
              Stop jumping between admin panels. Online Planet merges data from
              every source into a single source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Big Card: Multi-Store */}
            <div className="md:col-span-2 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 block">
                  Unified Data
                </span>
                <h3 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                  Compare Shopify vs Amazon ROAS in real-time.
                </h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed text-sm">
                  Our deep integration doesn't just pull orders—it correlates
                  your ad spend with actual revenue across every platform.
                </p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#96bf48] border border-gray-100">
                    <SiShopify size={24} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#FF9900] border border-gray-100">
                    <SiAmazon size={24} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#2874F0] border border-gray-100">
                    <SiFlipkart size={24} />
                  </div>
                </div>
              </div>
              {/* Abstract UI Backdrop */}
              <div className="absolute top-10 right-[-40px] w-80 h-full bg-indigo-50/50 rounded-t-[40px] border-l border-t border-indigo-100 hidden md:block p-8 translate-y-20 group-hover:translate-y-10 transition-transform duration-700">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-indigo-200/50 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-indigo-100/50 rounded-full"></div>
                  <div className="h-24 w-full bg-white rounded-2xl border border-indigo-100 shadow-sm flex items-end p-2 gap-1">
                    {[40, 70, 45, 90, 60].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-500/20 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card: Real-time */}
            <div className="bg-gray-900 rounded-[40px] p-10 text-white flex flex-col justify-between hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6">
                <FiZap size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-4">
                  60-Second Data Sync.
                </h3>
                <p className="text-gray-400 text-xs font-bold leading-relaxed">
                  Your inventory and orders are refreshed every minute. No more
                  overselling on Flipkart when you're out of stock on Shopify.
                </p>
              </div>
            </div>

            {/* Middle Card: Security */}
            <div className="bg-indigo-600 rounded-[40px] p-10 text-white flex flex-col justify-between hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6">
                <FiShield size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-4">
                  Bank-Grade Privacy.
                </h3>
                <p className="text-indigo-100 text-xs font-bold leading-relaxed">
                  Enterprise-grade AES-256 encryption protects your API keys.
                  Your data is your property, always.
                </p>
              </div>
            </div>

            {/* Middle Big Card: Global Terminal */}
            <div className="md:col-span-2 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="relative z-10 max-w-sm">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4 block">
                  Smart Search
                </span>
                <h3 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                  Find anything in seconds.
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  Search any order or SKU across all your stores instantly. No
                  more hunting through tabs.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-gray-400 text-xs font-bold max-w-xs transition-all group-hover:border-indigo-200">
                <FiArrowRight /> Search "ORD-54..."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- AI Intelligence Suite --- */}
      <section
        id="ai-suite"
        className="py-32 bg-gray-50 px-6 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Forecasting Visual */}
              <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-100 relative group">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-lg font-black tracking-tight">
                    AI Sales Forecast
                  </h4>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">
                    30-DAY PREDICTION
                  </div>
                </div>

                <div className="h-64 flex items-end gap-2 relative">
                  {/* Actual data */}
                  {[40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gray-200 transition-all hover:bg-gray-300"
                        style={{ height: `${h}%` }}
                      ></div>
                    ),
                  )}
                  {/* Forecasted data (Glow) */}
                  {[95, 100, 110, 105, 120].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] animate-pulse"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}

                  {/* Tooltip */}
                  <div className="absolute top-0 right-0 bg-gray-950 text-white p-4 rounded-2xl shadow-2xl border border-gray-800 -translate-y-4 group-hover:-translate-y-8 transition-transform">
                    <span className="text-[10px] font-black opacity-50 block mb-1">
                      PROVIEW FORECAST
                    </span>
                    <span className="text-xl font-black">
                      ₹4.2L <span className="text-xs text-green-400">+24%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Churn Bubble */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-[200px] animate-bounce-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">
                    !
                  </div>
                  <span className="text-[10px] font-black tracking-tighter">
                    CHURN RISK ALERT
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500">
                  12 High-value customers haven't ordered in 30 days.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest mb-6">
                Built with Gemini 2.0
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">
                Know exactly <br />
                <span className="text-indigo-600">what to sell next.</span>
              </h2>
              <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                Our AI tells you exactly when to restock and which marketing
                channels are wasting your money. No more guessing, just simple
                growth.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-black text-gray-900 mb-2">
                    Demand Forecasting
                  </h4>
                  <p className="text-sm font-medium text-gray-400">
                    Inventory predictions based on seasonal trends and ad-spend
                    correlation.
                  </p>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-2">
                    Profit Optimization
                  </h4>
                  <p className="text-sm font-medium text-gray-400">
                    AI-suggested pricing to maximize net-profit, not just gross
                    revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-200/30 blur-[120px] -z-10 rounded-full"></div>
      </section>

      {/* --- India-First Section --- */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4 block">
                Made for Indian Sellers
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">
                Built for the <br />
                <span className="text-orange-500 italic">Indian Seller.</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "GST-Ready Analytics",
                    desc: "Automated CGST/SGST/IGST breakdown for faster tax filing.",
                    icon: <FiCheckCircle className="text-green-500" />,
                  },
                  {
                    title: "Hinglish Support",
                    desc: "Toggle between English, Hindi, and Hinglish with one tap.",
                    icon: <FiCheckCircle className="text-orange-500" />,
                  },
                  {
                    title: "Tier 2/3 Intelligence",
                    desc: "Track shipping feasibility and COD returns in emerging cities.",
                    icon: <FiCheckCircle className="text-blue-500" />,
                  },
                  {
                    title: "WhatsApp Alert Hub",
                    desc: "Get real-time profit and stock alerts directly on WhatsApp.",
                    icon: <FiCheckCircle className="text-green-400" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 group p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
                  >
                    <span className="mt-1">{item.icon}</span>
                    <div>
                      <h4 className="font-black text-gray-900">{item.title}</h4>
                      <p className="text-sm font-bold text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="bg-white border border-gray-100 rounded-[48px] p-8 shadow-2xl relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Regional Reports
                  </span>
                  <FiGlobe className="text-indigo-600" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-sm font-bold text-gray-900">
                        Maharashtra
                      </span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">
                      ₹45,200
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-sm font-bold text-gray-900">
                        Delhi NCR
                      </span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">
                      ₹38,500
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-sm font-bold text-gray-900">
                        Tamil Nadu
                      </span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">
                      ₹12,400
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[65%]"></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Metro Cities (65%)
                  </span>
                </div>
              </div>

              {/* Language Toggle Mockup */}
              <div className="absolute top-20 -right-10 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-20 flex gap-4 animate-bounce-slow">
                <span className="text-xs font-black">EN</span>
                <div className="w-10 h-6 bg-white/20 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
                <span className="text-xs font-black opacity-50">हिं</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Excel vs Online Planet --- */}
      <section className="py-32 bg-gray-950 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              Stop fighting with{" "}
              <span className="text-red-500 italic">Excel.</span>
            </h2>
            <p className="text-gray-400 font-bold">
              Manual tracking is slow, error-prone, and kills profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {/* The Pain */}
            <div className="p-10 border border-gray-800 rounded-[40px] bg-gray-900/50">
              <h3 className="text-xl font-black mb-8 text-red-400 uppercase tracking-widest">
                The Old Way
              </h3>
              <ul className="space-y-6">
                {[
                  "Manual data export every morning",
                  "Broken formulas & spreadsheet lag",
                  "Zero real-time inventory visibility",
                  "Hidden costs (ad spend) not tracked",
                  "Requires 10+ hours a week",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm font-medium text-gray-500"
                  >
                    <span className="text-red-500">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-10 border-2 border-indigo-500 rounded-[40px] bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
              <h3 className="text-xl font-black mb-8 text-white uppercase tracking-widest">
                The Online Planet Way
              </h3>
              <ul className="space-y-6">
                {[
                  "100% Automated real-time sync",
                  "Beautiful, error-free visualizations",
                  "Live stock alerts across all channels",
                  "Integrated ROAS & Net Profit metrics",
                  "Saves 10+ hours a week",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm font-black text-white"
                  >
                    <span className="text-indigo-200">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- How it Works: Timeline --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-20">
            Connect and scale in 3 steps.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 hidden md:block -z-10 -translate-y-1/2"></div>

            {[
              {
                step: "01",
                title: "Connect Platforms",
                desc: "Authorize Shopify, Amazon, or Flipkart in 2 clicks with industry-grade security.",
              },
              {
                step: "02",
                title: "Automated Sync",
                desc: "We pull your past 90 days of data and set up real-time webhooks for live tracking.",
              },
              {
                step: "03",
                title: "Get Insights",
                desc: "Launch your dashboard and get clear, AI-driven profitable growth strategies.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative group hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm absolute -top-6 left-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h4 className="text-xl font-black text-gray-900 mt-4 mb-3">
                  {item.title}
                </h4>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              What founders are saying <br />
              <span className="text-gray-400">about Online Planet.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Robert Fox",
                role: "Founder @ StyleHub",
                text: "Online Planet cut our multi-platform reconciliation time by 80%. Truly game changing.",
                rating: 5,
              },
              {
                name: "Guy Hawkins",
                role: "Director @ TechStore",
                text: "The AI insights actually make sense. Most other tools just show stats, this tool shows opportunities.",
                rating: 5,
              },
              {
                name: "Darlene Robertson",
                role: "CEO @ LuxeDubai",
                text: "Implementation was so fast. We connected all our Shopify stores in less than 5 minutes.",
                rating: 5,
              },
              {
                name: "Kristin Watson",
                role: "E-com Head @ GearUp",
                text: "The regional profit analysis is essential for our expansion strategy in India. High recommendation!",
                rating: 5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex gap-0.5 text-yellow-500 text-xs mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6 flex-1 italic">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="text-sm font-black text-gray-900">{t.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section
        id="pricing"
        className="py-32 px-6 bg-gray-50/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Plans to power your growth.
            </h2>
            <p className="text-gray-500 font-bold">
              Start for free and scale as you grow. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Starter"
              price="999"
              description="Basic analytics for emerging D2C brands."
              features={[
                "2 Platform Sync (Shopify/Woo)",
                "1,000 Orders per month",
                "30-Day Data Retention",
                "Basic Sales Reports",
                "Email Support",
              ]}
              cta="Get Started"
              planId="starter"
              onSelect={handlePayment}
              isCurrentPlan={currentPlan === "starter"}
            />
            <PricingCard
              title="Growth"
              price="2,499"
              highlighted={true}
              description="Full performance suite for high-volume sellers."
              features={[
                "Unlimited Shopify/Woo Stores",
                "10,000 Orders per month",
                "90-Day Data History",
                "Full AI Predictive Engine",
                "WhatsApp Profit Alerts",
                "GST-Ready Reporting",
              ]}
              cta="Try Growth Free"
              planId="growth"
              onSelect={handlePayment}
              isCurrentPlan={currentPlan === "growth"}
            />
            <PricingCard
              title="Enterprise"
              price="9,999"
              description="Complete infrastructure for agencies & hubs."
              features={[
                "Amazon & Flipkart Integration",
                "Unlimited Orders & Data",
                "Custom AI Strategy Hub",
                "API & Webhook Access",
                "Dedicated Account Manager",
                "White-label Reports",
              ]}
              cta="Contact Sales"
              planId="enterprise"
              onSelect={handlePayment}
              isCurrentPlan={currentPlan === "enterprise"}
            />
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm font-bold">
              Looking for a custom plan?{" "}
              <Link href="/login" className="text-indigo-600 underline">
                Start with our Free Forever tier
              </Link>{" "}
              for up to 100 orders/mo.
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Frequently asked questions.
            </h2>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            <FAQItem
              question="Is my data secure?"
              answer="Absolutely. We use AES-256 encryption for all credentials and store data. We never share your data with 3rd parties and we are fully GDPR/CPRA compliant."
            />
            <FAQItem
              question="Can I connect multiple platforms?"
              answer="Yes, on the Growth plan and above, you can connect an unlimited number of Shopify and WooCommerce stores and view them on a unified dashboard."
            />
            <FAQItem
              question="How often does data sync?"
              answer="We sync your data in real-time for order webhooks and perform a full batch sync every 60 minutes to ensure total accuracy."
            />
            <FAQItem
              question="Do you offer a free trial?"
              answer="Yes, every new account starts with a 14-day Growth plan trial. No credit card is required to sign up."
            />
          </div>
        </div>
      </section>

      {/* --- CTA Footer Section --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
              Work faster with Online Planet.
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 font-bold opacity-80 mb-12">
              Join 1,000+ top Indian merchants scaling their brands with
              data-driven confidence.
            </p>
            <Link
              href="/login"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 inline-block"
            >
              Start Your Free Trial
            </Link>
          </div>
          {/* Abstract SVG Circles */}
          <div className="absolute top-0 right-0 p-10 opacity-10 text-white">
            <FiZap size={200} />
          </div>
          <div className="absolute -bottom-20 -left-20 opacity-10 text-white blur-xl">
            <FiShield size={300} />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <FiShield size={18} />
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tight">
                Online Planet
              </span>
            </Link>
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs">
              The ultimate e-commerce intelligence platform for Indian D2C
              brands.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
              >
                <FiInstagram />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
              >
                <FiTwitter />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
              >
                <FiLinkedin />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
              >
                <FiGithub />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-8 px-2 border-l-2 border-indigo-600">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Media Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-8 px-2 border-l-2 border-purple-600">
              Product
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-8 px-2 border-l-2 border-green-600">
              Resources
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400">
            © 2026 Online Planet. All rights reserved.
          </p>
          <p className="text-xs font-bold text-gray-400 tracking-tight">
            Built for{" "}
            <span className="text-indigo-600 font-black italic">
              Online Planet Dubai
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
