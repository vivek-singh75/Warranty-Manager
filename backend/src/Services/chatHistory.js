
const userHistories = new Map();

const SESSION_TTL = 5 * 60 * 1000; // 5 minutes

function getChatHistory(userId, sessionId) {
    const key = `${userId}:${sessionId}`;

    let session = userHistories.get(key);

    // Create new history if session doesn't exist or has expired
    if (!session || Date.now() - session.lastActivity > SESSION_TTL) {
        session = {
            history: [],
            lastActivity: Date.now()
        };

        userHistories.set(key, session);
    }

    session.lastActivity = Date.now();

    return session.history;
}

function clearChatSession(userId, sessionId) {
    const key = `${userId}:${sessionId}`;
    userHistories.delete(key);
}

function clearUserChatHistory(userId) {
    for (const key of userHistories.keys()) {
        if (key.startsWith(`${userId}:`)) {
            userHistories.delete(key);
        }
    }
}

// Periodically remove inactive sessions
setInterval(() => {
    const now = Date.now();

    for (const [key, session] of userHistories.entries()) {
        if (now - session.lastActivity > SESSION_TTL) {
            userHistories.delete(key);
        }
    }
}, 2 * 60 * 1000);

module.exports = {
    getChatHistory,
    clearChatSession,
    clearUserChatHistory
};
