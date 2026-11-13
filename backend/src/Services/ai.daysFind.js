const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
});

async function queryToDays(history) {


    const currentDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });

    const system_prompt = `
        You are a date and days extraction assistant.

        Today's date is ${currentDate}.

        Your only task is to extract the number of days from the user's query.

        1. If the user gives a duration like "next 10 days", return 10.
        2. If the user gives a specific date, calculate the number of days from today's date to that date.
        3. Return only valid JSON.
        4. If a valid date or duration is found:
        {
        "success": true,
        "days": <number>
        }
        5. If no valid date or duration is found:
        {
        "success": false,
        "question": "Please provide a valid date or number of days."
        }

        Do not perform any other task.
        `;

     const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: history,
        system_instruction: system_prompt,

    });

    //console.log(interaction.output_text);

    return interaction.output_text;
 

}


module.exports = queryToDays;

