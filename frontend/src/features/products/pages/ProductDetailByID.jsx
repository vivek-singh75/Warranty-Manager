
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    ArrowLeft, Smartphone, CalendarDays, IndianRupee,
    ShieldCheck, Clock, Pencil, Trash2, Hash, Store,
    MapPin, FileText, LoaderCircle, AlertCircle
} from "lucide-react";

import { useProducts } from "../hooks/useProducts";

const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const getWarrantyStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const days = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (days < 0)
        return { label: "Expired", days: Math.abs(days), color: "red" };

    if (days === 0)
        return { label: "Expires Today", days: 0, color: "amber" };

    if (days <= 30)
        return { label: "Expiring Soon", days, color: "amber" };

    return { label: "Active", days, color: "green" };
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex min-w-0 items-start gap-2">
        <Icon size={17} className="mt-1 shrink-0 text-slate-400" />

        <div className="min-w-0">
            <p className="mb-1 text-xs text-slate-500">{label}</p>
            <p className="break-words text-sm font-medium text-slate-200">
                {value || "Not provided"}
            </p>
        </div>
    </div>
);

const ProductDetailByID = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        product,
        loading,
        error,
        handleproductDetailsByID
    } = useProducts();

    useEffect(() => {
        if (id) handleproductDetailsByID(id);
    }, [id]);

    const handleDelete = () => {
        console.log("Delete product:", id);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <LoaderCircle className="mr-2 animate-spin" />
                Loading product details...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 p-5 text-white">
                <AlertCircle size={40} className="text-red-400" />

                <h2 className="text-lg font-semibold text-center">
                    {error || "Product not found"}
                </h2>

                <button
                    onClick={() => navigate("/productsdetails")}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 blur-[100%] px-3 pb-6 pt-15 text-white sm:px-5 md:px-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">

                    <button
                        onClick={() => navigate("/productsdetails")}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold shadow-md transition hover:bg-blue-500"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <span className="text-xs text-slate-400 sm:text-sm">
                        Product Details
                    </span>

                </div>

                {/* Product Header */}
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                            <Smartphone size={28} className="text-blue-400" />
                        </div>

                        <div className="min-w-0 flex-1">

                            <h1 className="break-words text-xl font-bold sm:text-2xl">
                                {product.productName}
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                {product.brand || "Unknown Brand"}
                                {" • "}
                                {product.category || "Uncategorized"}
                            </p>

                            {/* <p className="mt-1 break-all text-xs text-slate-500">
                                ID: {product._id}
                            </p> */}

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => navigate(`/products/edit/${id}`)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700"
                            >
                                <Pencil size={15} />
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                            >
                                <Trash2 size={15} />
                                Delete
                            </button>

                        </div>

                    </div>
                </div>

                {/* Purchase Information */}
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                        <CalendarDays size={19} className="text-blue-400" />
                        Purchase Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        <InfoItem
                            icon={CalendarDays}
                            label="Purchase Date"
                            value={formatDate(product.purchaseDate)}
                        />

                        <InfoItem
                            icon={IndianRupee}
                            label="Purchase Price"
                            value={
                                product.purchasePrice != null
                                    ? `₹${Number(product.purchasePrice).toLocaleString("en-IN")}`
                                    : "Not provided"
                            }
                        />

                        <InfoItem
                            icon={Store}
                            label="Seller"
                            value={product.seller}
                        />

                        <InfoItem
                            icon={Hash}
                            label="Serial Number"
                            value={product.serialNumber}
                        />

                    </div>
                </div>

                {/* Warranty Information */}
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                        <ShieldCheck size={19} className="text-blue-400" />
                        Warranty Information
                    </h2>

                    {product.warranty?.length > 0 ? (

                        <div className="space-y-3">

                            {product.warranty.map((warranty) => {

                                const status = getWarrantyStatus(warranty.expiryDate);

                                const statusColors = {
                                    green: "bg-green-500/10 text-green-400",
                                    amber: "bg-amber-500/10 text-amber-400",
                                    red: "bg-red-500/10 text-red-400"
                                };

                                return (
                                    <div
                                        key={warranty._id}
                                        className="rounded-lg border border-slate-800 p-4"
                                    >

                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                            <div>
                                                <h3 className="font-semibold">
                                                    {warranty.type} Warranty
                                                </h3>

                                                <p className="text-xs text-slate-400">
                                                    {warranty.durationMonths} Months
                                                </p>
                                            </div>

                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status.color]}`}>
                                                {status.label}
                                            </span>

                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                            <InfoItem
                                                icon={CalendarDays}
                                                label="Start Date"
                                                value={formatDate(warranty.startDate)}
                                            />

                                            <InfoItem
                                                icon={CalendarDays}
                                                label="Expiry Date"
                                                value={formatDate(warranty.expiryDate)}
                                            />

                                            <InfoItem
                                                icon={Clock}
                                                label="Time Remaining"
                                                value={
                                                    status.color === "red"
                                                        ? `${status.days} days ago`
                                                        : status.days === 0
                                                            ? "Expires today"
                                                            : `${status.days} days left`
                                                }
                                            />

                                            <InfoItem
                                                icon={MapPin}
                                                label="Warranty Card Location"
                                                value={warranty.placeOfWarrantyCard}
                                            />

                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                    ) : (
                        <p className="text-sm text-slate-400">
                            No warranty information available.
                        </p>
                    )}

                </div>

                {/* Additional Information */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

                    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
                        <FileText size={19} className="text-blue-400" />
                        Additional Information
                    </h2>

                    <p className="text-sm leading-6 text-slate-400">
                        {product.notes || "No additional notes available."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-800 pt-3 text-xs text-slate-500">

                        <span>
                            Created: {formatDate(product.createdAt)}
                        </span>

                        <span>
                            Updated: {formatDate(product.updatedAt)}
                        </span>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailByID;
