import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";

const ProductsDetails = () => {

    const {handleGetTopProduct ,handleDetailsByQuery} = useProducts()

    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);
    const [showProducts, setShowProducts] = useState(true);

    const [productData, setProductData] = useState([])

    const [isClicked, setIsClicked] = useState(false)

    const handleSend = async () => {
        if (!query.trim() || isClicked) return;

        setIsClicked(true)
        const result = await handleDetailsByQuery(query)

        setResponse(result)
        setShowProducts(false)

        // API call yahan karna hai
        // const result = await ...

        // response aane ke baad
        // setResponse(result);
        // setShowProducts(false);

        setQuery("");
        setIsClicked(false)
    };

    useEffect(()=>{
        const fetchData =async () => {
            try {
                const result = await handleGetTopProduct();

                setProductData(result.products)
                console.log(result)
                
            } catch (error) {
                console.error(error);
            }
            
        }
        fetchData()

    },[])


// const productData = [
//         {
//             "_id": "6ae5a6795f1fec7c597b0a18",
//             "productName": "Samsung TV",
//             "brand": "Samsung",
//             "category": "TV",
//             "warranty": [
//                 {
//                     "durationMonths": 24,
//                     "startDate": "2024-11-05T00:00:00.000Z",
//                     "expiryDate": "2026-11-05T00:00:00.000Z",
//                     "type": "Manufacturer",
//                 }
//             ],
//             "createdAt": "2026-10-31T08:27:37.798Z",
//             "updatedAt": "2026-10-31T08:27:37.798Z",
//         },
//         {
//             "_id": "6ae49196b1532386438687d6",
//             "productName": "realme mobile",
//             "brand": "realme",
//             "category": "mobile",
//             "warranty": [
//                 {
//                     "durationMonths": 24,
//                     "startDate": "2024-12-12T00:00:00.000Z",
//                     "expiryDate": "2026-12-12T00:00:00.000Z",
//                     "type": "Manufacturer",
//                 }
//             ],
//             "createdAt": "2026-10-30T12:46:14.313Z",
//             "updatedAt": "2026-10-30T12:46:14.313Z",
//         },
//         {
//             "_id": "6ae5a6795f1fgec7c597b0a18",
//             "productName": "Samsung TV",
//             "brand": "Samsung",
//             "category": "TV",
//             "warranty": [
//                 {
//                     "durationMonths": 24,
//                     "startDate": "2024-11-05T00:00:00.000Z",
//                     "expiryDate": "2026-11-05T00:00:00.000Z",
//                     "type": "Manufacturer",
//                 }
//             ],
//             "createdAt": "2026-10-31T08:27:37.798Z",
//             "updatedAt": "2026-10-31T08:27:37.798Z",
//         },
//         {
//             "_id": "6ae49g196b1532386438687d6",
//             "productName": "realme mobile",
//             "brand": "realme",
//             "category": "mobile",
//             "warranty": [
//                 {
//                     "durationMonths": 24,
//                     "startDate": "2024-12-12T00:00:00.000Z",
//                     "expiryDate": "2026-12-12T00:00:00.000Z",
//                     "type": "Manufacturer",
//                 }
//             ],
//             "createdAt": "2026-10-30T12:46:14.313Z",
//             "updatedAt": "2026-10-30T12:46:14.313Z",
//         },
//     ]

    return (
        <main className="h-dvh w-full bg-slate-950 pt-14 text-white">

            <div className="flex h-full">

                {/* Main Area */}
                <section
                    className={`
                        relative h-full
                        ${showProducts ? "w-full sm:w-[70%]" : "w-full"}
                        transition-all duration-300
                    `}
                >

                    {/* Mobile: Products initially */}
                    {showProducts && (
                        <div className="sm:hidden h-full p-4 pb-24 overflow-y-auto">

                            <h2 className="text-xl font-semibold mb-5 text-center">
                                Products Whose Expiry is Near
                            </h2>

                            <div className="space-y-5">
                                {productData.map((product) => (
                                    <div
                                        key={product._id}
                                        className="w-full max-w-xs mx-auto h-[23vh] bg-cyan-900/70 border border-cyan-700 rounded-xl p-3 shadow-md"  >
                                        <h3 className="text-lg font-semibold mb-1">
                                            {product.productName}
                                        </h3>

                                        <div className="space-y-1 text-sm text-gray-200">
                                            <p>
                                                <span className="text-gray-400">
                                                    Brand:
                                                </span>{" "}
                                                {product.brand}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Warranty Start:
                                                </span>{" "}
                                                {new Date(
                                                    product.warranty[0].startDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Warranty End:
                                                </span>{" "}
                                                {new Date(
                                                    product.warranty[0].expiryDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Duration:
                                                </span>{" "}
                                                {product.warranty[0].durationMonths} months
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* API Response */}
                    {!showProducts && response && (
                        <div className="h-full overflow-y-auto p-5 pb-24">

                            <div className="max-w-3xl mx-auto">

                                <div className="bg-blue-950/90 border border-slate-700 rounded-xl p-5">
                                    <h2 className="text-xl font-semibold mb-4">
                                        Response
                                    </h2>

                                    <p className="text-gray-200">
                                        {response.message}
                                    </p>

                                    {/* Agar response mein products aaye */}
                                    {response.products?.map((product) => (
                                        <div
                                            key={product._id}
                                            className="mt-4 bg-blue-950 rounded-lg p-4"
                                        >
                                            <h3 className="font-semibold">
                                                {product.productName}
                                            </h3>

                                            <p className="text-sm text-gray-300">
                                                Brand: {product.brand}
                                            </p>

                                            <p className="text-sm text-gray-300">
                                                Warranty End:{" "}
                                                {new Date(
                                                    product.warranty[0].expiryDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Input */}
                    <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 border-slate-700 backdrop-blur">
                        <div className="max-w-3xl mx-auto flex gap-2">

                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask something about your warranties..."
                                className="flex-1 px-4 py-3 rounded-xl bg-blue-950 border border-cyan-700 outline-none focus:border-cyan-400"
                            />

                            <button
                                onClick={handleSend}

                                className="px-5 py-3 rounded-xl bg-cyan-900 hover:bg-cyan-300 active:bg-cyan-400 font-medium transition"
                            >
                                {isClicked ? "Sending" : "Send"}
                            </button>

                        </div>
                    </div>

                </section>


                {/* Desktop / Tablet Expiring Products */}
                {showProducts && (
                    <section className="hidden sm:block w-[30%] h-full border-slate-500 border-l border-cyan-800">

                        <div className="h-full overflow-y-auto p-4">

                            <h2 className="text-lg font-semibold mb-5 text-center">
                                Products Whose Expiry is Near
                            </h2>

                            <div className="space-y-4">
                            
                                {productData.map((product) => (
                                    <div
                                        key={product._id}
                                        className="w-full max-w-xs mx-auto bg-cyan-900/70 border border-slate-700 rounded-xl p-3 shadow-md"                                    >

                                        <h3 className="font-semibold text-lg mb-3">
                                            {product.productName}
                                        </h3>

                                        <div className="space-y-2 text-sm">

                                            <p>
                                                <span className="text-gray-400">
                                                    Brand:
                                                </span>{" "}
                                                {product.brand}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Warranty Start:
                                                </span>{" "}
                                                {new Date(
                                                    product.warranty[0].startDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Warranty End:
                                                </span>{" "}
                                                {new Date(
                                                    product.warranty[0].expiryDate
                                                ).toLocaleDateString("en-IN")}
                                            </p>

                                            <p>
                                                <span className="text-gray-400">
                                                    Duration:
                                                </span>{" "}
                                                {product.warranty[0].durationMonths} months
                                            </p>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </section>
                )}

            </div>

        </main>
    );
};


export default ProductsDetails    

