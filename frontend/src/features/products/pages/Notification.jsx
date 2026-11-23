
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellRing,
  Search,
  Laptop,
  CalendarDays,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Package,
  ArrowLeft
} from "lucide-react";

import { useProducts } from "../hooks/useProducts";



const getDaysRemaining = (date) => {
  const today = new Date();
  const expiry = new Date(date);

  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const expiryUTC = Date.UTC(
    expiry.getUTCFullYear(),
    expiry.getUTCMonth(),
    expiry.getUTCDate()
  );

  return Math.ceil(
    (expiryUTC - todayUTC) / (1000 * 60 * 60 * 24)
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
};

const getStatus = (days) => {
  if (days <= 2) {
    return {
      label: "Urgent",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30"
    };
  }

  if (days <= 5) {
    return {
      label: "Warning",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30"
    };
  }

  return {
    label: "Upcoming",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30"
  };
};


export default function Notifications() {
  const navigate = useNavigate();
  const {handleExpiringNotification} = useProducts();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await handleExpiringNotification();
        console.log(response)
    //   if (!response.ok) {
    //     throw new Error("Unable to fetch notifications");
    //   }

      

      const result = await response

      if (result.success) {
        const products = result.productData || [];

        // Convert product warranty data into notifications
        const formatted = products.flatMap((product) =>
          (product.warranty || []).map((warranty, index) => ({
            id: `${product._id}-${index}`,
            productId: product._id,
            productName: product.productName,
            brand: product.brand,
            expiryDate: warranty.expiryDate,
            durationMonths: warranty.durationMonths,
            daysLeft: getDaysRemaining(warranty.expiryDate)
          }))
        );

        setNotifications(formatted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Notification statistics
  const stats = useMemo(() => ({
    total: notifications.length,
    urgent: notifications.filter(n => n.daysLeft <= 2).length,
    warning: notifications.filter(
      n => n.daysLeft > 2 && n.daysLeft <= 5
    ).length,
    upcoming: notifications.filter(n => n.daysLeft > 5).length
  }), [notifications]);

  // Search and filter
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        (item.brand || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "urgent" && item.daysLeft <= 2) ||
        (filter === "warning" &&
          item.daysLeft > 2 && item.daysLeft <= 5) ||
        (filter === "upcoming" && item.daysLeft > 5);

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  // Open product details
  const handleOpenProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Dismiss notification from current UI
  const handleDismiss = (id) => {
    setNotifications(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#050B1D] text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-900/60 bg-[#06265A]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/15 p-2">
              <ShieldCheck className="h-8 w-8 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-lg font-bold sm:text-xl">
                Warranty <span className="text-cyan-400">Manager</span>
              </h1>
              <p className="hidden text-[10px] tracking-wider text-blue-200 sm:block">
                TRACK • MANAGE • NEVER MISS A WARRANTY
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-blue-400/30 p-2.5 transition hover:bg-blue-500/20"
            aria-label="Go home"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <BellRing size={16} />
              Smart Warranty Alerts
            </div>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Notifications
            </h2>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Stay updated. Never miss a warranty expiry.
            </p>
          </div>

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            title="Total Alerts"
            count={stats.total}
            icon={<Bell size={21} />}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />

          <StatCard
            title="Urgent"
            count={stats.urgent}
            icon={<AlertTriangle size={21} />}
            color="text-red-400"
            bg="bg-red-500/10"
          />

          <StatCard
            title="Warning"
            count={stats.warning}
            icon={<Clock size={21} />}
            color="text-amber-400"
            bg="bg-amber-500/10"
          />

          <StatCard
            title="Upcoming"
            count={stats.upcoming}
            icon={<CalendarDays size={21} />}
            color="text-cyan-400"
            bg="bg-cyan-500/10"
          />

        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl border border-blue-900/60 bg-[#0A1530] p-4">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder="Search product or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-blue-900/70 bg-[#050D20] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">

              {[
                ["all", "All"],
                ["urgent", "Urgent"],
                ["warning", "Warning"],
                ["upcoming", "Upcoming"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    filter === value
                      ? "bg-blue-600 text-white"
                      : "border border-blue-900/60 bg-[#101D38] text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}

            </div>

          </div>
        </div>

        {/* Notification list */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold sm:text-xl">
            Recent Notifications
          </h3>

          <span className="text-xs text-slate-500 sm:text-sm">
            {filteredNotifications.length} results
          </span>
        </div>

        {loading ? (

          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-blue-900/50 bg-[#0A1530]">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm text-slate-400">
              Loading notifications...
            </p>
          </div>

        ) : error ? (

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <AlertTriangle className="mx-auto mb-3 text-red-400" size={32} />
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold"
            >
              Try Again
            </button>
          </div>

        ) : filteredNotifications.length === 0 ? (

          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-blue-900/50 bg-[#0A1530] px-5 text-center">

            <div className="mb-4 rounded-full bg-blue-500/10 p-5">
              <ShieldCheck size={42} className="text-cyan-400" />
            </div>

            <h3 className="text-xl font-bold">
              {notifications.length === 0
                ? "You're All Caught Up!"
                : "No Matching Notifications"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-400">
              {notifications.length === 0
                ? "There are no products approaching warranty expiry. Your products are looking good!"
                : "Try changing your search or notification filter."}
            </p>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              View All Notifications
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredNotifications.map((item) => {

              const status = getStatus(item.daysLeft);

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-blue-900/60 bg-[#0A1530] p-4 transition hover:border-blue-500/60 hover:bg-[#0D1B38] sm:p-5"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    {/* Product icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                      <Laptop className="h-7 w-7 text-cyan-400" />
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-2 flex flex-wrap items-center gap-2">

                        <h4 className="text-lg font-bold">
                          {item.productName}
                        </h4>

                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>

                      </div>

                      <p className="mb-3 text-sm text-slate-400">
                        Brand: {item.brand || "Not specified"}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400 sm:text-sm">

                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-cyan-400" />
                          Expires: {formatDate(item.expiryDate)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock size={15} className="text-cyan-400" />
                          {item.daysLeft === 0
                            ? "Expires today"
                            : `${item.daysLeft} days remaining`}
                        </span>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">

                      <button
                        onClick={() => handleOpenProduct(item.productId)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:flex-none"
                      >
                        View Product
                        <ChevronRight size={17} />
                      </button>

                      <button
                        onClick={() => handleDismiss(item.id)}
                        title="Dismiss notification"
                        className="rounded-xl border border-blue-900/60 p-3 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                  {/* Expiry progress */}
                  <div className="mt-5 border-t border-blue-900/40 pt-4">

                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Warranty expiry approaching</span>
                      <span>{item.daysLeft} days left</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          item.daysLeft <= 2
                            ? "bg-red-500"
                            : item.daysLeft <= 5
                              ? "bg-amber-400"
                              : "bg-cyan-400"
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, ((7 - item.daysLeft) / 7) * 100)
                          )}%`
                        }}
                      />
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-blue-900/50 py-8 text-center">

          <ShieldCheck className="h-7 w-7 text-cyan-400" />

          <p className="font-semibold text-slate-300">
            Warranty Manager
          </p>

          <p className="text-xs text-slate-500">
            Keep your products protected and stay informed.
          </p>

        </div>

      </main>
    </div>
  );
}


// Reusable statistics card
function StatCard({ title, count, icon, color, bg }) {
  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#0A1530] p-4 transition hover:border-blue-500/40 sm:p-5">

      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 sm:text-sm">
          {title}
        </span>

        <div className={`rounded-lg p-2 ${bg} ${color}`}>
          {icon}
        </div>
      </div>

      <h3 className="text-2xl font-extrabold sm:text-3xl">
        {count}
      </h3>

    </div>
  );
}
