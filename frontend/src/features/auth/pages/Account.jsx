
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    Hash,
    Package,
    LogOut,
    Trash2,
    ShieldCheck,
    AlertTriangle,
    X
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const Account = () => {
    const { alluserData, logout } = useAuth();
    const navigate = useNavigate();

    const [loggingOut, setLoggingOut] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const user = alluserData.user;
    const userName = user?.name || "User";
    const firstLetter = userName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 pt-15 text-white sm:px-6 md:px-8">

            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-7 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            My Account
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Manage your account details and settings.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50 sm:px-4"
                    >
                        <LogOut size={17} />
                        <span>
                            {loggingOut ? "Logging out..." : "Logout"}
                        </span>
                    </button>

                </div>

                {/* Profile Card */}
                <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">

                    <div className="flex flex-col items-center gap-4 sm:flex-row">

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-3xl font-bold text-blue-400">
                            {firstLetter}
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold sm:text-2xl">
                                {userName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {user?.email}
                            </p>

                            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                                <ShieldCheck size={14} />
                                Account Active
                            </div>
                        </div>

                    </div>

                </div>

                {/* Account Statistics */}
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-1">

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <Package size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Total Products
                                </p>

                                <h3 className="text-2xl font-bold">
                                    {alluserData?.productdata ?? "—"}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                                <ShieldCheck size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Account Status
                                </p>

                                <h3 className="text-lg font-semibold text-green-400">
                                    Active
                                </h3>
                            </div>

                        </div>

                    </div> */}

                </div>

                {/* Personal Information */}
                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                    <h2 className="mb-5 text-lg font-semibold">
                        Personal Information
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-slate-800 p-2.5 text-blue-400">
                                <UserRound size={19} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">
                                    Full Name
                                </p>

                                <p className="break-words text-sm font-medium">
                                    {user?.name || "Not available"}
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-slate-800 p-2.5 text-blue-400">
                                <Mail size={19} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">
                                    Email Address
                                </p>

                                <p className="break-all text-sm font-medium">
                                    {user?.email || "Not available"}
                                </p>
                            </div>

                        </div>

                        {/* <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-slate-800 p-2.5 text-blue-400">
                                <Hash size={19} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">
                                    User ID
                                </p>

                                <p className="break-all text-xs font-medium text-slate-300">
                                    {user?.id || "Not available"}
                                </p>
                            </div>

                        </div> */}

                    </div>

                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-6">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                            <h2 className="flex items-center gap-2 font-semibold text-red-400">
                                <AlertTriangle size={18} />
                                Danger Zone
                            </h2>

                            <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
                                Deleting your account is permanent and may remove all your saved products and data.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                        >
                            <Trash2 size={17} />
                            Delete Account
                        </button>

                    </div>

                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">

                        <div className="mb-4 flex items-center justify-between">

                            <h2 className="font-semibold text-red-400">
                                Delete Account
                            </h2>

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <p className="text-sm leading-6 text-slate-300">
                            Are you sure you want to delete your account?
                            This action cannot be undone.
                        </p>

                        <p className="mt-3 text-xs text-amber-400">
                            Account deletion API is not connected yet. No data will be deleted.
                        </p>

                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="mt-5 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium hover:bg-slate-700"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </main>
    );
};

export default Account;
