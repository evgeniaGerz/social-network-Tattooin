import axios from "./axios";

export function getAllFriends() {
    return axios.get("/friends/something").then(({ data }) => {
        console.log("data in axios.get/friends: ", data);
        return {
            type: "RECEIVE_FRIENDS",
            friends: data
        };
    });
}

export function acceptFriendRequest(id) {
    return axios.post("/friendstatus/accept/" + id).then(data => {
        console.log("data in axios.post/friendstatus/accept: ", data);
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id
        };
    });
}

export function unfriend(id) {
    console.log("mayday");
    return axios.post("/friendstatus/delete/" + id).then(data => {
        console.log("data in axios.post//friendstatus/delete: ", data);
        return {
            type: "UNFRIEND",
            id
        };
    });
}
