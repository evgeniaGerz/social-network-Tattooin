import axios from "./axios";

export function getAllFriends() {
    return axios.get("/friends/something").then(({ data }) => {
        return {
            type: "RECEIVE_FRIENDS",
            friends: data
        };
    });
}

export function acceptFriendRequest(id) {
    return axios.post("/friendstatus/accept/" + id).then(data => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id
        };
    });
}

export function unfriend(id) {
    return axios.post("/friendstatus/delete/" + id).then(data => {
        return {
            type: "UNFRIEND",
            id
        };
    });
}

// will add here functions: onlineUsers, userLeft, userJoined
export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users
    };
}

export function userLeft(userId) {
    return {
        type: "USER_LEFT",
        userId
    };
}

export function userJoined(user) {
    return {
        type: "USER_JOINED",
        user
    };
}

export function getChatMessages(messages) {
    return {
        type: "CHAT_MESSAGES",
        messages: messages
    };
}

export function newChatMessage(newMessage) {
    return {
        type: "NEW_CHAT_MESSAGE",
        newMessage: newMessage
    };
}
