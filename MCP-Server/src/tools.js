const z = require("zod");
const moment = require('moment');

function registerGetExpiringWarranties(server) {
    server.registerTool(
        "get-expiring-warranties",
        {
            description:
                "Get products whose warranty will expire within the specified number of days.",

            inputSchema: z.object({
                days: z.number().int().min(1).max(365)
            })
        },

        async ({ days }) => {
            // database logic here

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            days
                        })
                    }
                ]
            };
        }
    );
}



module.exports = {
    registerGetExpiringWarranties,

};