
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
});

async function queryToTool(history) {

    const currentDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });

    const system_prompt = `
You are an MCP tool selection assistant for a Warranty Manager application.

Today's date is ${currentDate}.

Your task:
Understand the user's query and select the correct MCP tool.
Extract the required arguments for that tool.

AVAILABLE TOOLS:

1. getAllProducts
   Use when the user wants to see all their products.
   Arguments:
   - productName: ""
   - brand: ""
   - days: 0
   - startDate: ""
   - endDate: ""

2. getProductByName
   Use when the user searches for a specific product by its name.
   Arguments:
   - productName: required
   - brand: ""
   - days: 0
   - startDate: ""
   - endDate: ""

3. getProductsByBrand
   Use when the user wants products belonging to a particular brand.
   Arguments:
   - brand: required
   - productName: ""
   - days: 0
   - startDate: ""
   - endDate: ""

4. getProductsByDays
   Use when the user asks which products will expire within the next
   specified number of days.
   Arguments:
   - days: required
   - productName: ""
   - brand: ""
   - startDate: ""
   - endDate: ""

5. getProductsByExpiryDate
   Use when the user specifies an exact expiry date or expiry date range.
   Arguments:
   - startDate: required
   - endDate: required
   - productName: ""
   - brand: ""
   - days: 0

6. getProductsByPurchaseDate
   Use when the user wants products purchased on a particular date
   or within a date range.
   Arguments:
   - startDate: required
   - endDate: required
   - productName: ""
   - brand: ""
   - days: 0

7. getProductByMonths
   Use when the user asks which products will expire within
   the next specified number of months.

   Arguments:
   - months: required integer between 1 and 36.
   - productName: ""
   - brand: ""
   - days: 0
   - startDate: ""
   - endDate: ""

   Examples:
   "Products expiring in next 2 months" -> months: 2
   "Products expiring in next 1 year" -> months: 12
   "Products expiring in next 3 years" -> months: 36

   Never use days for this tool.

RULES:

1. Select only one tool for each query.
2. Never invent product names, brands, dates or durations.
3. Convert relative dates into YYYY-MM-DD format.
4. If the user says today, use today's date.
5. If the user says tomorrow, calculate tomorrow's date.
6. For a specific expiry date, use getProductsByExpiryDate.
7. For a duration like next 10 days, use getProductsByDays.
8. If required information is missing, ask a short question.
9. If the query is unclear, ask the user instead of guessing.
10. Never generate userId. Backend will provide userId separately.
11. Do not answer the user's product query yourself.


OUTPUT RULES:

If a tool can be selected:
{
    "success": true,
    "toolName": "MCP_TOOL_NAME",
    "arguments": {
        "productName": "",
        "brand": "",
        "days": 0,
        "startDate": "",
        "endDate": ""
    },
    "question": ""
}

If information is missing or query is unclear:
{
    "success": false,
    "toolName": "none",
    "arguments": {
        "productName": "",
        "brand": "",
        "days": 0,
        "startDate": "",
        "endDate": ""
    },
    "question": "Ask the user for the missing information."
}
`;

    const responseSchema = {
        type: "object",
        properties: {
            success: {
                type: "boolean"
            },
            toolName: {
                type: "string",
                enum: [
                    "getAllProducts",
                    "getProductByName",
                    "getProductsByBrand",
                    "getProductsByDays",
                    "getProductByMonths",
                    "getProductsByExpiryDate",
                    "getProductsByPurchaseDate",
                    "none"
                ]
            },
            arguments: {
                type: "object",
                properties: {
                    productName: { type: "string" },
                    brand: { type: "string" },
                    days: { type: "integer" },
                    months: { type: "integer"},
                    startDate: { type: "string" },
                    endDate: { type: "string" }
                },
                required: [
                    "productName",
                    "brand",
                    "days",
                    "startDate",
                    "endDate"
                ],
                additionalProperties: false
            },
            question: {
                type: "string"
            }
        },
        required: [
            "success",
            "toolName",
            "arguments",
            "question"
        ],
        additionalProperties: false
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

    return JSON.parse(interaction.output_text);
}

module.exports = queryToTool;
