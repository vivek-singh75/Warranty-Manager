import React from "react";
import { Link } from "react-router-dom";
import {
    ShieldCheck,
    Sparkles,
    Clock,
    ArrowRight,
    Plus,
    Package
} from "lucide-react";

const Home = () => {

    const features = [
        {
            icon: ShieldCheck,
            title: "Warranty Tracking",
            description: "Manage all your product warranties in one place."
        },
        {
            icon: Sparkles,
            title: "AI-Powered Entry",
            description: "Add products easily using simple natural language."
        },
        {
            icon: Clock,
            title: "Expiry Monitoring",
            description: "Keep track of upcoming warranty expirations."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            {/* Hero */}
            <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden px-5 py-19 md:py-42 text-center">

                <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" />

                <div className="relative max-w-3xl">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-400">
                        <Sparkles size={15} />
                        Smart Warranty Management
                    </div>

                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        Manage Your Warranties
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            The Smarter Way.
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                        Keep all your product warranties organized in one place.
                        Track expiry dates and let AI simplify product management.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            to="/AddProducts"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold transition hover:bg-blue-500"
                        >
                            <Plus size={17} />
                            Add Product
                        </Link>

                        <Link
                            to="/productsdetails"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-7 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            <Package size={17} />
                            View Products
                        </Link>

                    </div>

                </div>
            </section>

            {/* Features */}
            <section className="border-t border-slate-800 px-5 py-10">

                <div className="mx-auto max-w-5xl">

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Everything You Need
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Simple tools for smarter warranty management.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">

                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-blue-500/40"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                        <Icon size={21} />
                                    </div>

                                    <h3 className="mt-4 text-base font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-5 py-8">

                <div className="mx-auto max-w-5xl rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/70 to-slate-900 px-5 py-10 text-center">

                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Ready to Get Started?
                    </h2>

                    <p className="mt-3 text-sm text-slate-400">
                        Organize your warranties. Stay ahead of expiry dates.
                    </p>

                    <Link
                        to="/register"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
                    >
                        Create Free Account
                        <ArrowRight size={16} />
                    </Link>

                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 px-5 py-5">

                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">

                    <h3 className="font-bold">
                        Warranty<span className="text-blue-400">Manager</span>
                    </h3>

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Warranty Manager. All rights reserved.
                    </p>

                </div>
            </footer>

        </main>
    );
};

export default Home;