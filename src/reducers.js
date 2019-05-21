export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        return Object.assign({}, state, {
            ...state,
            friends: action.friends
        });
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        return Object.assign({}, state, {
            friends: state.friends.map(user => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return Object.assign({}, user, {
                        accepted: true
                    });
                }
            })
        });
    } else if (action.type == "UNFRIEND") {
        return Object.assign({}, state, {
            friends: state.friends.filter(user => user.id != action.id)
        });
    } else if (action.type == "ONLINE_USERS") {
        return Object.assign({}, state, {
            ...state,
            onlineusers: action.onlineusers
        });
    } else if (action.type == "USER_JOINED") {
        return Object.assign({}, state, {
            onlineusers: state.onlineusers.concat(action.onlineusers)
        });
    } else if (action.type == "USER_LEFT") {
        return Object.assign({}, state, {
            ...state,
            onlineusers: state.onlineusers.filter(user => {
                return user.id != action.user;
            })
        });
    } else if (action.type == "CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.messages
        };
    } else if (action.type == "NEW_CHAT_MESSAGE") {
        return {
            ...state,
            chatMessages: state.chatMessages.concat(action.newMessage)
        };
    }
    return state;
}
