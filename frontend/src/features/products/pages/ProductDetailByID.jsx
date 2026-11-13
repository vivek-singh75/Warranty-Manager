
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    ArrowLeft, Smartphone,CalendarDays,  IndianRupee,
    ShieldCheck, Clock, Pencil, Trash2, Hash, Store,
    MapPin,FileText, LoaderCircle, AlertCircle
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

    if (days < 0) {
        return {
            label: "Expired",
            days: Math.abs(days),
            color: "red"
        };
    }

    if (days === 0) {
        return {
            label: "Expires Today",
            days: 0,
            color: "amber"
        };
    }

    if (days <= 30) {
        return {
            label: "Expiring Soon",
            days,
            color: "amber"
        };
    }

    return {
        label: "Active",
        days,
        color: "green"
    };
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">

        <Icon size={19} className="text-slate-400 mt-1" />

        <div>
            <p className="text-xs text-slate-500 mb-1">
                {label}
            </p>

            <p className="text-sm font-medium text-slate-200 break-words">
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
        if (id) {
            handleproductDetailsByID(id);
        }
    }, [id]);

    const handleDelete = () => {
        // Delete API integration will be added separately.
        console.log("Delete product:", id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <LoaderCircle className="animate-spin mr-2" />
                Loading product details...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4 p-5">

                <AlertCircle size={45} className="text-red-400" />

                <h2 className="text-xl font-semibold">
                    {error || "Product not found"}
                </h2>

                <button
                    onClick={() => navigate("/products")}
                    className="text-blue-400 hover:underline"
                >
                    Back to Products
                </button>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">

            <div className="max-w-5xl mx-auto">

                {/* Header */}

                <div className="flex justify-between items-center mb-8">

                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </button>

                    <span className="text-sm text-slate-500">
                        Product Details
                    </span>

                </div>

                {/* Product Header */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Smartphone size={38} className="text-blue-400" />
                        </div>

                        <div className="flex-1">

                            <h1 className="text-2xl md:text-3xl font-bold">
                                {product.productName}
                            </h1>

                            <p className="text-slate-400 mt-2">
                                {product.brand || "Unknown Brand"}
                                {" • "}
                                {product.category || "Uncategorized"}
                            </p>

                            <p className="text-xs text-slate-500 mt-2">
                                ID: {product._id}
                            </p>

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => navigate(`/products/edit/${id}`)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                            >
                                <Pencil size={16} />
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

                {/* Purchase Information */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <CalendarDays className="text-blue-400" />
                        Purchase Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-blue-400" />
                        Warranty Information
                    </h2>

                    {product.warranty?.length > 0 ? (

                        <div className="space-y-4">

                            {product.warranty.map((warranty) => {

                                const status = getWarrantyStatus(
                                    warranty.expiryDate
                                );

                                const statusColors = {
                                    green: "bg-green-500/10 text-green-400",
                                    amber: "bg-amber-500/10 text-amber-400",
                                    red: "bg-red-500/10 text-red-400"
                                };

                                return (

                                    <div
                                        key={warranty._id}
                                        className="border border-slate-800 rounded-xl p-5"
                                    >

                                        <div className="flex justify-between items-center flex-wrap gap-3 mb-6">

                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {warranty.type} Warranty
                                                </h3>

                                                <p className="text-sm text-slate-400">
                                                    {warranty.durationMonths} Months
                                                </p>
                                            </div>

                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[status.color]}`}>
                                                {status.label}
                                            </span>

                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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

                        <p className="text-slate-400">
                            No warranty information available.
                        </p>

                    )}

                </div>

                {/* Additional Information */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <FileText className="text-blue-400" />
                        Additional Information
                    </h2>

                    <p className="text-sm text-slate-400 leading-relaxed">
                        {product.notes || "No additional notes available."}
                    </p>

                    <div className="border-t border-slate-800 mt-6 pt-4 text-xs text-slate-500 flex flex-wrap gap-5">

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
