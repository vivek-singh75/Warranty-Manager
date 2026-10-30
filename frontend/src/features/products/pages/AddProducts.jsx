import { useState } from "react";
import { useProducts } from "../hooks/useProducts";

const AddProducts = () => {

    const { handleAddProducts ,handleSubmitDetails} = useProducts();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [productData, setProductData] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const handleSend = async () => {

        if (!message.trim()) return;

        const userMessage = message;

        // User message show karo
        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        try {

            const response = await handleAddProducts(userMessage);

            // Server ka response chat me show karo
            console.log(response)
            setMessages((prev) => [
                ...prev,
                {
                    type: "server",
                    text: response.message
                }
            ]);

            console.log(response)

            // Agar product information complete hai
            if (response.success === true) {

                setIsComplete(true);
                setProductData(response.productDetails);

            }else if(response.success === false && response.status === "missing"){
              
              setIsComplete(false)
              setProductData(null)
            }
          

        } catch (error) {

            setMessages((prev) => [
                ...prev,
                {
                    type: "server",
                    text: "Something went wrong. Please try again."
                }
            ]);
            throw error

        }
    };


    const handleCancel = () => {
        setIsComplete(false);
        setProductData(null);
    };


    const handleSubmit = async () => {
      // separate submit API call
      try {
        const response = await handleSubmitDetails(productData);

        console.log("Submitting product:", productData);
        

      } catch (error) {
        console.log(error.message)
        throw error
      }

    };


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
                                            {productData.productName}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Brand:
                                            </span>{" "}
                                            {productData.brand}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Category:
                                            </span>{" "}
                                            {productData.category}
                                        </p>

                                        <p>
                                            <span className="font-medium text-white">
                                                Purchase Date:
                                            </span>{" "}
                                            {new Date(productData.purchaseDate).toLocaleDateString(
                                              "en-IN",
                                              {
                                                day: "2-digit",
                                                month: "short",
                                                year:"numeric"
                                              }
                                            )}
                                        </p>
                                        <p>
                                            <span className="font-medium text-white">
                                                Warranty Expiry:
                                            </span>{" "}
                                            {new Date(productData.warranty[0].expiryDate).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </p>

                                    </div>


                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500"
                                        >
                                            Submit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>
                    )}

                </section>


                {/* Input */}
                <section className="shrink-0 border-t border-slate-800 bg-slate-950 p-3 sm:p-4">

                    <div className="mx-auto flex max-w-4xl items-end gap-2 sm:gap-3">

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter product information..."
                            rows="1"
                            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 sm:text-base"
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                            className="h-11 rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-500 active:bg-cyan-700 sm:px-6"
                        >
                            Send
                        </button>

                    </div>

                </section>

            </div>

        </main>
    );
};

export default AddProducts;