
import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Send, Plus, Package, LoaderCircle } from "lucide-react";

const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

// Product Card
const ProductCard = ({ product, onClick }) => {
    const warranty = product.warranty?.[0];

    return (
        <button
            onClick={onClick}
            className="w-full rounded-xl border border-cyan-700 bg-cyan-900/70 p-3 text-left shadow-md transition hover:border-cyan-400 hover:bg-cyan-900"
        >
            <h3 className="mb-2 text-sm font-semibold sm:text-base">
                {product.productName}
            </h3>

            <div className="space-y-1.5 text-xs text-gray-200 sm:text-sm">
                <p>
                    <span className="text-gray-400">Brand:</span>{" "}
                    {product.brand || "Not provided"}
                </p>

                <p>
                    <span className="text-gray-400">Warranty Start:</span>{" "}
                    {formatDate(warranty?.startDate)}
                </p>

                <p>
                    <span className="text-gray-400">Warranty End:</span>{" "}
                    {formatDate(warranty?.expiryDate)}
                </p>

                <p>
                    <span className="text-gray-400">Duration:</span>{" "}
                    {warranty?.durationMonths
                        ? `${warranty.durationMonths} months`
                        : "Not provided"}
                </p>
            </div>
        </button>
    );
};

const ProductsDetails = () => {

    const { handleGetTopProduct, handleDetailsByQuery } = useProducts();

    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);

    const [showProducts, setShowProducts] = useState(true);
    const [productData, setProductData] = useState([]);

    const [isClicked, setIsClicked] = useState(false);

    // Follow-up question
    const [question, setQuestion] = useState(null);

    // Previous query context
    const [pendingQuery, setPendingQuery] = useState("");

    // Conversation messages
    const [messages, setMessages] = useState([]);

    const [apiError, setApiError] = useState("");

    // Fetch top products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await handleGetTopProduct();

                if (result?.success) {
                    setProductData(
                        Array.isArray(result.products)
                            ? result.products
                            : []
                    );
                }

            } catch (error) {
                console.error("Top products error:", error);
            }
        };

        fetchData();

    }, []);

    // Send Query
    const handleSend = async () => {

        const userMessage = query.trim();

        if (!userMessage || isClicked) return;

        setIsClicked(true);
        setApiError("");
        setShowProducts(false);

        // Combine original query with follow-up answers
        const combinedQuery = pendingQuery
            ? `${pendingQuery}\nAdditional information: ${userMessage}`
            : userMessage;

        // Show user message
        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: userMessage
            }
        ]);

        setQuery("");

        try {

            const result = await handleDetailsByQuery(combinedQuery);

            console.log("API Response:", result);

            // SUCCESS RESPONSE
            if (result?.success === true) {

                setResponse(result);
                setQuestion(null);
                setPendingQuery("");

                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content: result.message ||
                            "Here are the matching products."
                    }
                ]);

            }

            // FOLLOW-UP QUESTION
            else if (result?.success === false) {

                const nextQuestion =
                    result.message?.question ||
                    (typeof result.message === "string"
                        ? result.message
                        : "Please provide some more information.");

                setQuestion(nextQuestion);
                setResponse(null);

                // Preserve previous query and answers
                setPendingQuery(combinedQuery);

                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content: nextQuestion
                    }
                ]);

                console.log("Follow-up question:", nextQuestion);

            }

            else {
                setApiError("Unexpected response from server.");
            }

        } catch (error) {

            console.error("Query error:", error);

            setApiError(
                error.response?.data?.message?.question ||
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setIsClicked(false);
        }
    };

    // Start a new search
    const handleNewSearch = () => {
        setQuery("");
        setResponse(null);
        setQuestion(null);
        setPendingQuery("");
        setMessages([]);
        setApiError("");
        setShowProducts(true);
    };

    return (
        <main className="h-dvh w-full overflow-hidden bg-slate-950  pt-14 text-white">

            <div className="flex h-full">

                {/* Main Area */}
                <section
                    className={`
                        relative h-full min-w-0
                        ${showProducts ? "w-full sm:w-[70%]" : "w-full"}
                        transition-all duration-300
                    `}
                >

                    {/* Mobile Top Products */}
                    {showProducts && (
                        <div className="h-full overflow-y-auto p-4 pb-24 sm:hidden">

                            <h2 className="mb-5 text-center text-xl font-semibold">
                                Products Whose Expiry is Near
                            </h2>

                            <div className="mx-auto max-w-sm space-y-3">

                                {productData.length > 0 ? (
                                    productData.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onClick={() =>
                                                navigate(
                                                    `/productDetailsById/${product._id}`
                                                )
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-sm text-slate-400">
                                        No products available.
                                    </p>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Conversation / API Response */}
                    {!showProducts && (
                        <div className="h-full overflow-y-auto p-4 pb-28 sm:p-5 sm:pb-28">

                            <div className="mx-auto max-w-3xl">

                                {/* Header */}
                                <div className="mb-5 flex items-center justify-between">

                                    <h2 className="text-lg font-semibold sm:text-xl">
                                        Warranty Assistant
                                    </h2>

                                    <button
                                        onClick={handleNewSearch}
                                        className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800 sm:text-sm"
                                    >
                                        <Plus size={15} />
                                        New Search
                                    </button>

                                </div>

                                {/* Messages */}
                                <div className="space-y-4">

                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >

                                            <div
                                                className={`
                                                    max-w-[90%] rounded-xl px-4 py-3 text-sm leading-6
                                                    sm:max-w-[80%]
                                                    ${
                                                        message.role === "user"
                                                            ? "bg-blue-600 text-white"
                                                            : "border border-slate-700 bg-slate-900 text-slate-200"
                                                    }
                                                `}
                                            >
                                                {message.content}
                                            </div>

                                        </div>
                                    ))}

                                </div>

                                {/* API Error */}
                                {apiError && (
                                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                                        {apiError}
                                    </div>
                                )}

                                {/* Follow-up Question */}
                                {question && (
                                    <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-300">
                                        Please provide the requested information to continue.
                                    </div>
                                )}

                                {/* Loading */}
                                {isClicked && (
                                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Processing your request...
                                    </div>
                                )}

                                {/* Result Products */}
                                {response?.success === true && (
                                    <div className="mt-6">

                                        <h3 className="mb-4 flex items-center gap-2 font-semibold">
                                            <Package
                                                size={18}
                                                className="text-cyan-400"
                                            />
                                            Matching Products
                                        </h3>

                                        {response.products?.length > 0 ? (
                                            <div className="grid gap-3 sm:grid-cols-2">

                                                {response.products.map(product => (
                                                    <ProductCard
                                                        key={product._id}
                                                        product={product}
                                                        onClick={() =>
                                                            navigate(
                                                                `/productDetailsById/${product._id}`
                                                            )
                                                        }
                                                    />
                                                ))}

                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">
                                                No matching products found.
                                            </p>
                                        )}

                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur sm:p-4">

                        <div className="mx-auto flex max-w-3xl gap-2">

                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={
                                    question
                                        ? "Answer the question..."
                                        : "Ask something about your warranties..."
                                }
                                disabled={isClicked}
                                className="w-full max-w-xs mx-auto rounded-xl border border-[#29466F] bg-[#101F3C] 
                                    p-4 shadow-lg transition-all duration-200 hover:border-blue-500/60 hover:bg-[#14294D]"                             />

                            <button
                                onClick={handleSend}
                                disabled={isClicked || !query.trim()}
                                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-medium transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                            >
                                {isClicked ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <>
                                        <Send size={17} />
                                        <span className="hidden sm:inline">
                                            Send
                                        </span>
                                    </>
                                )}
                            </button>

                        </div>
                    </div>

                </section>

                {/* Desktop / Tablet Products Sidebar */}
                {showProducts && (
                    <section className="hidden h-full w-[30%] border-l border-cyan-800 sm:block">

                        <div className="h-full overflow-y-auto p-4">

                            <h2 className="mb-5 text-center text-lg font-semibold">
                                Products Whose Expiry is Near
                            </h2>

                            <div className="mx-auto max-w-sm space-y-3">

                                {productData.length > 0 ? (
                                    productData.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onClick={() =>
                                                navigate(
                                                    `/productDetailsById/${product._id}`
                                                )
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-sm text-slate-400">
                                        No products available.
                                    </p>
                                )}

                            </div>
                        </div>

                    </section>
                )}

            </div>

        </main>
    );
};

export default ProductsDetails;
