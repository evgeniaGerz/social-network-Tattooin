import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllFriends, unfriend, acceptFriendRequest } from "./actions";
import Profilepic from "./profilepic";

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(getAllFriends());
    }
    render() {
        console.log("this.props.friends: ", this.props.friends);
        console.log("this.props.wannabies: ", this.props.wannabies);
        return (
            <div className="friends-container">
                <h2>Friends</h2>
                <div className="acceptedfriends-container">
                    {this.props.friends &&
                        this.props.friends.map(user => {
                            console.log("user: ", user);
                            return (
                                <div className="friend-card" key={user.id}>
                                    <div className="user">
                                        <img src={user.users_pic} />
                                    </div>
                                    <h3 className="friends-names">
                                        {user.first} {user.last}
                                    </h3>
                                    <button
                                        className="unfriend-button"
                                        onClick={() =>
                                            this.props.dispatch(
                                                unfriend(user.id)
                                            )
                                        }
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <h2>Wannabies</h2>
                <div className="wannabies-container">
                    {this.props.wannabies &&
                        this.props.wannabies.map(user => {
                            console.log("user: ", user);
                            return (
                                <div className="friend-card" key={user.id}>
                                    <div className="user">
                                        <img src={user.users_pic} />
                                    </div>
                                    <h3 className="friends-names">
                                        {user.first} {user.last}
                                    </h3>
                                    <div className="buttons-container">
                                        <button
                                            className="friend-button"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptFriendRequest(user.id)
                                                )
                                            }
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="unfriend-button"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    unfriend(user.id)
                                                )
                                            }
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("state in mapStateToProps:", state);
    // state refers to the global REDUX state
    return {
        friends:
            state.friends &&
            state.friends.filter(friends => friends.accepted == true),
        wannabies:
            state.friends &&
            state.friends.filter(friends => friends.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
