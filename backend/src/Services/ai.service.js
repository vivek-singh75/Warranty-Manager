const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
});

async function productDetailsFromAI(history) {

    const system_prompt= ` You are a warranty information assistant.
    
    Convert the user's message into structured product and warranty information.

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
    1. Extract only information provided by the user. Do not guess or invent data.
    2. If any required information is missing, ask the user only for the missing information.
    3. Do not ask for optional information.
    4. Do not calculate expiryDate. The server will calculate it.
    5. Return the extracted information in JSON format when all required information is available.
    6. If information is missing, return a short question asking for it.
    7. if warranty.type is not defined then use "Manufacturer" as default type


    Output format:
    {
    "status": "complete",
    "product": {
        "productName": "",
        "brand": "",
        "category": "",
        "purchaseDate": "",
        "purchasePrice": null,
        "warranty": {
        "durationMonths": null,
        "startDate": "",
        "type": "",
        "placeOfWarrantyCard": ""
        },
        "serialNumber": "",
        "seller": "",
        "notes": ""
    }
    }

    If required information is missing:
    {
    "status": "missing",
    "missing": ["fieldName"],
    "question": "..."
    }`


    const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: history,
        system_instruction: system_prompt,

    });

    //console.log(interaction.output_text);

    return interaction;
}


module.exports = productDetailsFromAI
