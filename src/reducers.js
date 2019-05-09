export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        console.log("action in RECEIVE_FRIENDS: ", action);
        return Object.assign({}, state, {
            ...state,
            friends: action.friends
        });
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        console.log("state in reducer: ", state);
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
        console.log("state in reducer: ", state);
        return Object.assign({}, state, {
            friends: state.friends.filter(user => user.id != action.id)
        });
    }
    return state;
}
