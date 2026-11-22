const SESSION_KEY = "warranty_chat_session";

export function getChatSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
}

export function clearLocalChatSession() {
    sessionStorage.removeItem(SESSION_KEY);
}