const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
});

async function productDetailsFromAI(history) {

    const currentDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });

    const system_prompt= ` You are a warranty information assistant.
    
    Convert the user's message into structured product and warranty information.
    
    current date(todays date) is = ${currentDate}

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
    4. if user says "i purchesed today" "aaj purchese kiya hu" then use current date and find the exact date 
        user also can say "i purchesed yesterday" then you have to calculate date according to currentdate
    5. Do not calculate expiryDate. The server will calculate it.
    6. Return the extracted information in JSON format when all required information is available.
    7. If information is missing, return a short question asking for it.
    8. if warranty.type is not defined then use "Manufacturer" as default type
    9. if user tell the place of warranty card store it in warranty.placeOfWarrantyCard


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
