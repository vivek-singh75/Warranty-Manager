
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useProducts";

const AddProducts = () => {

    const { handleAddProducts, handleSubmitDetails } = useProducts();

    const messagesEndRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [productData, setProductData] = useState(null);

    const [isComplete, setIsComplete] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Safe date formatter
    const formatDate = (date) => {
        if (!date) return "Not provided";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not provided";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Handle different server message formats
    const getServerMessage = (response) => {
        if (typeof response?.message === "string") {
            return response.message;
        }

        if (response?.message?.question) {
            return response.message.question;
        }

        if (response?.message?.message) {
            return response.message.message;
        }

        return "Something went wrong. Please try again.";
    };

    // Send message to AI
    const handleSend = async () => {

        const userMessage = message.trim();

        if (!userMessage || isSending || isSubmit) return;

        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: userMessage
            }
        ]);

        setMessage("");
        setIsSending(true);

        try {

            const response = await handleAddProducts(userMessage);

            console.log("Add Product Response:", response);

            // Product information complete
            if (response?.success === true) {

                setIsComplete(true);
                setProductData(response.productDetails || null);

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "server",
                        text: getServerMessage(response) ===
                            "Something went wrong. Please try again."
                            ? "Product information is complete. Please review the details and submit."
                            : getServerMessage(response)
                    }
                ]);

            }

            // More information required
            else if (
                response?.success === false &&
                response?.status === "missing"
            ) {

                setIsComplete(false);
                setProductData(null);

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "server",
                        text: getServerMessage(response)
                    }
                ]);

            }

            // Other unsuccessful response
            else {

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "server",
                        text: getServerMessage(response)
                    }
                ]);

            }

        } catch (error) {

            console.error("Add Product Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    type: "server",
                    text:
                        error.response?.data?.message?.question ||
                        error.response?.data?.message ||
                        error.message ||
                        "Something went wrong. Please try again."
                }
            ]);

        } finally {
            setIsSending(false);
        }
    };

    // Cancel product confirmation
    const handleCancel = () => {

        if (isSubmit) return;

        setIsComplete(false);
        setProductData(null);

    };

    // Submit product details
    const handleSubmit = async () => {

        if (isSubmit || !productData) return;

        setIsSubmit(true);

        try {

            const response = await handleSubmitDetails(productData);

            console.log("Submit Product Response:", response);

            if (response?.success === true) {

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "server",
                        text: getServerMessage(response) ===
                            "Something went wrong. Please try again."
                            ? "Product added successfully!"
                            : getServerMessage(response)
                    }
                ]);

                setIsComplete(false);
                setProductData(null);

            } else {

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "server",
                        text: getServerMessage(response)
                    }
                ]);

            }

        } catch (error) {

            console.error("Submit Product Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    type: "server",
                    text:
                        error.response?.data?.message?.question ||
                        error.response?.data?.message ||
                        error.message ||
                        "Unable to save product. Please try again."
                }
            ]);

        } finally {
            setIsSubmit(false);
        }
    };

    // Auto scroll to latest message
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, isComplete]);

    const warranty = productData?.warranty?.[0];

    return (
        <main className="h-dvh w-full bg-cyan-900 pt-14">

            <div className="flex h-full w-full flex-col bg-slate-950">

                {/* Chat Area */}
                <section className="flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-6">

                    {/* Initial Message */}
                    {messages.length === 0 && (
                        <div className="flex h-full items-center justify-center">

                            <div className="max-w-2xl text-center">

                                <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl md:text-3xl">
                                    Add Product
                                </h2>

                                <p className="text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
                                    Please provide complete information about the product.
                                    <br />
                                    Product name, purchase date, warranty period,
                                    warranty start date, etc.
                                </p>

                            </div>

                        </div>
                    )}

                    {/* Chat Messages */}
                    {messages.length > 0 && (
                        <div className="mx-auto max-w-4xl space-y-4">

                            {messages.map((item, index) => (

                                <div
                                    key={index}
                                    className={`flex ${
                                        item.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[70%] sm:text-base ${
                                            item.type === "user"
                                                ? "rounded-br-sm bg-cyan-700 text-white"
                                                : "rounded-bl-sm bg-slate-800 text-slate-200"
                                        }`}
                                    >
                                        {item.text}
                                    </div>

                                </div>

                            ))}

                            {/* Product Confirmation */}
                            {isComplete && productData && (

                                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">

                                    <h3 className="mb-4 text-lg font-semibold text-white">
                                        Product Information
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-300">

                                        <p>
                                            <span className="font-medium text-white">
                                                Product:
                                            </span>{" "}
                                            {productData.productName || "Not provided"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Brand:
                                            </span>{" "}
                                            {productData.brand || "Not provided"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Category:
                                            </span>{" "}
                                            {productData.category || "Not provided"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Purchase Date:
                                            </span>{" "}
                                            {formatDate(productData.purchaseDate)}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Warranty Expiry:
                                            </span>{" "}
                                            {formatDate(warranty?.expiryDate)}
                                        </p>

                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isSubmit || isSending}
                                            className="rounded-lg bg-cyan-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isSubmit ? "Saving..." : "Submit"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSubmit}
                                            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                            {/* Scroll Target */}
                            <div ref={messagesEndRef} />

                        </div>
                    )}

                    {/* Loading Message */}
                    {isSending && (
                        <div className="mx-auto mt-4 max-w-4xl text-sm text-slate-400">
                            AI is processing your information...
                        </div>
                    )}

                </section>

                {/* Input */}
                <section className="shrink-0 border-t border-slate-800 bg-slate-950 p-3 sm:p-4">

                    <div className="mx-auto flex max-w-4xl items-end gap-2 sm:gap-3">

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Enter product information..."
                            rows="1"
                            disabled={isSending || isSubmit}
                            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 sm:text-base"
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isSending || isSubmit || !message.trim()}
                            className="h-11 rounded-xl bg-cyan-950 px-4 text-sm font-semibold text-white transition hover:bg-cyan-200 active:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
};

export default AddProducts;
