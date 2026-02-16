"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

const SourceCard = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="bg-white px-6 py-4 rounded-[22px] border border-gray-100/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4 min-w-[180px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 cursor-default">
    <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
    <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">{label}</span>
  </div>
);

const IntegrationFlow = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-24 px-4 py-32">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative lg:px-20">
        
        {/* Left Side: Integration Sources */}
        <div className="flex flex-col gap-5 z-10 w-full md:w-auto relative">
          <div className="grid grid-cols-1 gap-4">
            <SourceCard icon={<SiShopify className="text-[#96bf48]" />} label="Shopify" />
            <SourceCard icon={<SiWoocommerce className="text-[#96588a]" />} label="Woo" />
            <SourceCard icon={<SiAmazon className="text-[#FF9900]" />} label="Amazon" />
            <SourceCard icon={<SiFlipkart className="text-[#2874F0]" />} label="Flipkart" />
            <SourceCard icon={<FiTrendingUp className="text-indigo-600" />} label="Meta Ads" />
            <SourceCard icon={<FiGlobe className="text-blue-500" />} label="Marketing" />
          </div>
        </div>

        {/* Center: Online Planet Hub */}
        <div className="relative z-20 my-16 md:my-0">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[40px] bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_20px_60px_rgba(79,70,229,0.3)] relative group cursor-pointer overflow-hidden leading-none">
            <FiShield size={56} className="relative z-10 drop-shadow-lg" />
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-[40px] border-[3px] border-white/20 animate-[ping_3s_linear_infinite] opacity-30"></div>
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-20 bg-indigo-500/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
        </div>

        {/* Right Side: Output / Growth */}
        <div className="relative z-10 w-full md:w-auto">
          <div className="bg-white p-10 md:p-12 rounded-[52px] border border-gray-100 shadow-[0_30px_100px_rgba(0,0,0,0.05)] space-y-10 max-w-sm mx-auto relative overflow-visible">
            <div className="text-center">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-2">Impact</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight block">Business Growth</span>
              <div className="inline-flex mt-3 items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
                <FiTrendingUp size={10} /> 150%
              </div>
            </div>
            
            {/* Miniature Bars */}
            <div className="flex items-end justify-between h-40 gap-4 px-2">
              {[35, 60, 45, 95, 65, 85].map((h, i) => (
                <div key={i} className={`w-full rounded-2xl transition-all duration-1000 ${i % 2 === 0 ? "bg-indigo-50" : "bg-indigo-600 shadow-[0_10px_30px_rgba(79,70,229,0.2)]"}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            
            <div className="pt-8 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
               <span className="opacity-60">June 02</span>
               <span className="opacity-60">June 23</span>
            </div>

            {/* Floating Performance Tag */}
            <div className="absolute -top-12 -right-8 md:-right-12 bg-gray-950 text-white p-7 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-start min-w-[160px] animate-bounce-slow">
               <span className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] mb-2">Increase Rate</span>
               <div className="flex items-center gap-3">
                 <span className="text-3xl font-black">150%</span>
                 <span className="text-2xl text-white/40">↗</span>
               </div>
            </div>
          </div>
        </div>

        {/* Connecting Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full -z-10 hidden md:block opacity-60" viewBox="0 0 1200 600" preserveAspectRatio="none">
          {/* Paths with more elegant curvature */}
          <path d="M280 150 Q 500 150, 600 300" stroke="url(#gradient-in)" strokeWidth="1.5" strokeDasharray="8 12" className="animate-flow" fill="none" />
          <path d="M280 450 Q 500 450, 600 300" stroke="url(#gradient-in)" strokeWidth="1.5" strokeDasharray="8 12" className="animate-flow" fill="none" />
          <path d="M280 300 L 600 300" stroke="url(#gradient-in)" strokeWidth="1.5" strokeDasharray="8 12" className="animate-flow" fill="none" />
          
          {/* Outgoing Flow (Output) */}
          <path d="M600 300 C 750 300, 800 300, 920 300" stroke="url(#gradient-out)" strokeWidth="3" strokeDasharray="10 15" className="animate-flow-output" fill="none" />
          
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
}: any) => (
  <div
    className={`relative p-8 rounded-[40px] flex flex-col transition-all duration-500 ${highlighted ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105 z-10" : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md"}`}
  >
    {highlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
        Most Popular
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
    <Link
      href="/login"
      className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center transition-all ${highlighted ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200"}`}
    >
      {cta}
    </Link>
  </div>
);

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
  return (
    <div className="min-h-screen bg-[#fcfcfd] selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

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
            Transform business with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
              AI Intelligence.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Online Planet empowers Indian e-commerce brands to scale faster
            using multi-platform sync and predictive AI insights. All your data,
            unified.
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

        {/* Muted Abstract Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-radial from-indigo-100/40 to-transparent -z-10 blur-3xl opacity-50"></div>
      </section>

      {/* --- Trusted By / Partners --- */}
      <section className="py-20 border-y border-gray-50 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
            Seamlessly Integrated With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <SiShopify size={36} className="text-[#96bf48]" />
            <SiWoocommerce size={48} className="text-[#96588a]" />
            <SiAmazon size={40} className="text-[#FF9900]" />
            <SiFlipkart size={40} className="text-[#2874F0]" />
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-900">
              <FiLayers className="text-indigo-600" /> Nietzsche
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Smart solution for <br />
              <span className="text-indigo-600">seamless operations.</span>
            </h2>
            <p className="text-gray-500 font-bold max-w-xl mx-auto">
              Everything you need to handle high-volume e-commerce without the
              administrative headache.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FiZap}
              color="bg-indigo-600"
              title="Real-time Sync"
              description="Inventory, orders, and customer data synced across Shopify and WooCommerce every 60 seconds."
            />
            <FeatureCard
              icon={FiTrendingUp}
              color="bg-purple-600"
              title="Profit Analysis"
              description="Calculate true net profit after deductions for shipping, payment gateways, and GST automatically."
            />
            <FeatureCard
              icon={FiGlobe}
              color="bg-blue-600"
              title="Regional Insights"
              description="Deep dive into state-wise performance in India to optimize your regional ads and logistics."
            />
            <FeatureCard
              icon={FiShield}
              color="bg-green-600"
              title="Secure Storage"
              description="Enterprise-grade encryption for all API keys. Your store data is protected and private."
            />
            <FeatureCard
              icon={FiLayers}
              color="bg-yellow-600"
              title="Multi-Store Hub"
              description="Switch between different brands or franchises instantly from one central command center."
            />
            <FeatureCard
              icon={FiBarChart2}
              color="bg-rose-600"
              title="Advanced Reports"
              description="Visual reports for order cohort analysis, customer retention, and life-time value (LTV)."
            />
          </div>
        </div>
      </section>

      {/* --- Dynamic Content Section --- */}
      <section
        id="solutions"
        className="py-24 bg-gray-950 text-white overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
              India Focused Analytics
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight">
              Personalized user experience <br />
              <span className="text-gray-500 italic">& recommendations.</span>
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-500 shrink-0">
                  <FiZap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">
                    Custom Workflow Insights
                  </h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Our AI analyzes your return reasons and helps you identify
                    which products need better quality checks.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-500 shrink-0">
                  <FiLayers size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">
                    Omnichannel Management
                  </h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Stop jumping between tabs. Compare Amazon and Shopify
                    performance side-by-side in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-[40px] border border-gray-800 shadow-3xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <SiShopify />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">
                      New Order - Fashion Paradise
                    </div>
                    <div className="text-sm font-bold">
                      ₹2,499 from Bangalore
                    </div>
                  </div>
                  <div className="text-[10px] text-green-400 font-bold">
                    +0.5% Profit
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <SiWoocommerce />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">
                      Stock Alert - TechHub
                    </div>
                    <div className="text-sm font-bold">
                      Wireless Buds SKU running low
                    </div>
                  </div>
                  <div className="text-[10px] text-red-400 font-bold">
                    Priority
                  </div>
                </div>
                <div className="h-32 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 p-4 flex flex-col justify-end">
                  <div className="flex gap-1 items-end">
                    {[30, 60, 45, 80, 50, 95, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-500 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                    Revenue Momentum: +24% Today
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 blur-[100px] opacity-20 -z-10"></div>
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
              price="49"
              description="Basic analytics for emerging D2C brands."
              features={[
                "Single Platform Sync (Shopify)",
                "Store Dashboard",
                "Basic Sales Reports",
                "Email Support",
                "1 Monthly AI Insight",
              ]}
              cta="Get Started"
            />
            <PricingCard
              title="Growth"
              price="199"
              highlighted={true}
              description="Full performance suite for growing enterprises."
              features={[
                "Unlimited Platforms (Shopify/Woo)",
                "Advanced AI Predictive Engine",
                "Net Profit & GST Analysis",
                "Customer Cohort Tracking",
                "Priority Support (24/7)",
              ]}
              cta="Try Growth Free"
            />
            <PricingCard
              title="Enterprise"
              price="499"
              description="Complete infrastructure for agencies & hubs."
              features={[
                "White-label Reports",
                "Amazon & Flipkart Integration",
                "Custom API Access",
                "Dedicated Account Manager",
                "Custom Slack Alerts",
              ]}
              cta="Contact Sales"
            />
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
