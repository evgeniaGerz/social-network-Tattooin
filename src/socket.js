import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    getChatMessages,
    newChatMessage
} from "./actions";

export let socket;

export function init(store) {
    if (!socket) {
        console.log("in the init of socket.js");
        //if there is no connection, create this one
        socket = io.connect();

        socket.on("chatMessages", messages => {
            // data should be an array of 10 or fewer objects in it
            store.dispatch(getChatMessages(messages));
        });

        socket.on("newChatMessages", message => {
            store.dispatch(newChatMessage(message));
        });

        //this will run as soon as receive the message from the server
        socket.on("onlineUsers", users => {
            console.log("users in onlineUsers: ", users);
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            console.log("users in userJoined: ", user);
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", userId => {
            store.dispatch(userLeft(userId));
        });
    }
}
