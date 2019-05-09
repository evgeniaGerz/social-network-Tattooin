import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft } from "./actions";

export let socket;

export function init(store) {
    if (!socket) {
        //if there is no connection, create this one
        socket = io.connect();

        socket.on("chatMessages", data => {
            // data should be an array of 10 or fewer objects in it
            store.dispatch(getMostRecentChats(data));
        });

        socket.on("chatMessageForRedux", data => {
            store.dispatch(addNewChatToRedux(data));
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
    // return socket;
}
