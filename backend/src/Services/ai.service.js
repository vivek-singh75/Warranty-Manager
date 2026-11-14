
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
});

async function productDetailsFromAI(history) {

    const currentDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });

    const system_prompt = `
You are a warranty information assistant.

Convert the user's messages into structured product and warranty information.

Today's date is ${currentDate}.

Required information:
- productName
- purchaseDate
- warranty.durationMonths
- warranty.startDate

Optional information:
- brand
- category
- purchasePrice
- warranty.type
- warranty.placeOfWarrantyCard
- serialNumber
- seller
- notes

Rules:

1. Extract only information provided by the user. Never guess or invent data.
2. If any required information is missing, return status "missing".
3. Ask only for missing required information.
4. Never ask for optional information.
5. If the user says today or yesterday, calculate the exact date using today's date.
6. Never calculate expiryDate. Server will calculate it.
7. If warranty.type is missing, use "Manufacturer".
8. If warranty.placeOfWarrantyCard is provided, save it if not then use null.
9. If all required information is available, return status "complete".
10. Maintain conversation context and combine previous information with new user answers.
11. If the user gives irrelevant information, politely ask for the required product information.
12. Return only structured JSON matching the provided schema.
`;

    const responseSchema = {
        type: "object",
        properties: {
            status: {
                type: "string",
                enum: ["complete", "missing"]
            },
            missing: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            question: {
                type: "string"
            },
            product: {
                type: "object",
                properties: {
                    productName: {
                        type: "string"
                    },
                    brand: {
                        type: "string"
                    },
                    category: {
                        type: "string"
                    },
                    purchaseDate: {
                        type: "string"
                    },
                    purchasePrice: {
                        type: "number",
                        nullable: true
                    },
                    warranty: {
                        type: "object",
                        properties: {
                            durationMonths: {
                                type: "integer"
                            },
                            startDate: {
                                type: "string"
                            },
                            type: {
                                type: "string"
                            },
                            placeOfWarrantyCard: {
                                type: "string"
                            }
                        },
                        required: [
                            "durationMonths",
                            "startDate",
                            "type",
                            
                        ]
                    },
                    serialNumber: {
                        type: "string"
                    },
                    seller: {
                        type: "string"
                    },
                    notes: {
                        type: "string"
                    }
                },
                required: [
                    "productName",
                    "purchaseDate",
                    "warranty",
                ]
            }
        },
        required: [
            "status",
            "missing",
            "question",
            "product"
        ]
    };

    const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: history,
        system_instruction: system_prompt,

        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: responseSchema
        }
    });

    console.log("AI Structured Response:", interaction.output_text);

    return interaction;
}

module.exports = productDetailsFromAI;
