
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
    Bell,
    Menu,
    X,
    ChevronDown
} from "lucide-react";

import Logo_with_text from "../../assets/Logo_with_text.png";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const { user, isAuthenticated } = useAuth();

    const userName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "User";

    const firstLetter = userName.charAt(0).toUpperCase();

    const linkStyle = ({ isActive }) =>
        `rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            isActive
                ? "bg-cyan-950 text-white shadow-sm"
                : "text-white hover:bg-blue-100 hover:text-blue-700"
        }`;

    const closeMenu = () => {
        setMenuOpen(false);
        setAccountOpen(false);
    };

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-blue-300 bg-[#00255c] shadow-sm">

            <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <NavLink to="/" onClick={closeMenu}>
                    <img
                        src={Logo_with_text}
                        alt="Warranty Manager"
                        className="h-16 w-auto object-contain"
                    />
                </NavLink>


                {/* Desktop Navigation */}
                <div className="hidden items-center gap-2 md:flex">

                    {isAuthenticated && (
                        <>
                            <NavLink to="/AddProducts" className={linkStyle}>
                                Add Products
                            </NavLink>

                            <NavLink to="/productsdetails" className={linkStyle}>
                                Products
                            </NavLink>
                        </>
                    )}

                </div>


                {/* Desktop Right Actions */}
                <div className="hidden items-center gap-3 md:flex">

                    {isAuthenticated ? (
                        <>
                            {/* Notification */}
                            <button
                                type="button"
                                aria-label="Notifications"
                                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Bell size={20} />
                            </button>

                            {/* Account */}
                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="flex items-center gap-3 text-white h-13 rounded-2xl px-3 py-2 transition hover:border-blue-300 hover:bg-blue-500"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                        {firstLetter}
                                    </div>

                                    <NavLink  to="/account"
                                        className="text-left">
                                        <p className=" text-sx">
                                            Account
                                        </p>

                                        <p className="max-w-28 truncate text-sm font-semibold text-slate-100">
                                            {userName}
                                        </p>
                                    </NavLink>

                                    <ChevronDown
                                        size={16}
                                        className={`text-white transition ${
                                            accountOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {accountOpen && (
                                    <div className="absolute right-0 top-14 w-60 rounded-xl border border-blue-100 bg-white p-4 shadow-xl">

                                        <NavLink  to="/account"
                                            className="flex items-center gap-3 border-b border-slate-100 pb-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                                {firstLetter}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {userName}
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    {user?.email || "Account"}
                                                </p>
                                            </div>

                                        </NavLink>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Welcome to Warranty Manager!
                                        </p>

                                    </div>
                                )}

                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>


                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm transition hover:bg-blue-100 md:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>

            </div>


            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="border-t border-blue-100 bg-[#5f7ab9] px-4 py-4 shadow-lg md:hidden">

                    <div className="flex flex-col gap-2">

                        {isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/AddProducts"
                                    onClick={closeMenu}
                                    className={linkStyle}
                                >
                                    Add Products
                                </NavLink>

                                <NavLink
                                    to="/productsdetails"
                                    onClick={closeMenu}
                                    className={linkStyle}
                                >
                                    Products
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-100 hover:text-blue-700"
                                >
                                    <Bell size={19} />
                                    Notifications
                                </button>

                                {/* Mobile Account */}
                                <NavLink to="/account"
                                    className="mt-2 flex items-center gap-3 border-t border-blue-100 px-4 pt-4">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                        {firstLetter}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white">
                                            {userName}
                                        </p>

                                        <p className="text-xs text-blue-100">
                                            Account
                                        </p>
                                    </div>

                                </NavLink>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-100 hover:text-blue-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    </div>

                </div>
            )}

        </nav>
    );
};

export default Navbar;
