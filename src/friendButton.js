import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        console.log("props in FriendButton: ", props); // id - someone's user id, loggedId - mine id
        // props is other user id
        this.state = {
            buttonText: "",
            nextAction: "",
            friendStatus: false,
            friendWaiting: false
        };
        this.clickFriendButton = this.clickFriendButton.bind(this);
        this.unfriendButton = this.unfriendButton.bind(this);
    }
    clickFriendButton(evt) {
        // nextAction are "send", "delete", "accept",
        console.log("evt is: ", evt);
        if (evt === "send") {
            axios.post("/friendstatus/send/" + this.props.id).then(() => {
                console.log("made it here");
                this.setState({
                    friendStatus: false,
                    nextAction: "accept",
                    buttonText: "Request sent"
                });
            });
        } else if (evt === "accept") {
            axios.post("/friendstatus/accept/" + this.props.id).then(() => {
                this.setState({
                    friendStatus: true,
                    nextAction: "delete",
                    buttonText: "Unfriend"
                });
            });
        }
    }
    unfriendButton(evt) {
        console.log("evt is: ", evt);
        axios.post("/friendstatus/delete/" + this.props.id).then(() => {
            console.log("blabla");
            this.setState({
                buttonText: "Let's be friends",
                friendStatus: false,
                nextAction: "send"
            });
        });
    }

    componentDidMount() {
        axios.get("/friendstatus/check/" + this.props.id).then(({ data }) => {
            console.log("data in get /friendstatus/check: ", data);
            // if two users are not friends yet
            if (!data) {
                this.setState({
                    buttonText: "Let's be friends",
                    nextAction: "send",
                    friendStatus: false
                });
                console.log("We're not friends yet");
            }
            // if two users are friends already
            else if (data.accepted) {
                this.setState({
                    buttonText: "Unfriend",
                    nextAction: "delete",
                    friendStatus: true
                });
                console.log("We're friends now");
            }
            // if logged-in user is sender of friend request
            else if (
                // false is default value in the table
                data.sender_id == this.props.loggedId
            ) {
                this.setState({
                    buttonText: "Request sent",
                    nextAction: "accept",
                    friendStatus: false
                });
                console.log("Friend request pending");
            }
            // if logged-in user is recipient of friend request
            else if (data.recipient_id == this.props.loggedId) {
                this.setState({
                    buttonText: "Accept",
                    nextAction: "accept",
                    friendStatus: false,
                    friendWaiting: true
                });
                console.log("Someone waits for you to accept");
            }
        });
    }
    render() {
        if (this.state.friendWaiting) {
            return (
                <div className="friend-button-container">
                    <button
                        className="friend-button"
                        type="button"
                        id={this.props.id}
                        onClick={() => {
                            this.clickFriendButton(this.state.nextAction);
                        }}
                    >
                        {this.state.buttonText}
                    </button>
                    <button
                        className="unfriend-button"
                        type="button"
                        id={this.props.loggedId}
                        onClick={() => {
                            this.unfriendButton();
                        }}
                    >
                        DECLINE
                    </button>
                </div>
            );
        } else {
            return (
                <div className="friend-button-container">
                    <button
                        className="friend-button"
                        type="button"
                        id={this.props.id}
                        onClick={e => {
                            console.log("button clicked: ", e);
                            this.clickFriendButton(this.state.nextAction);
                        }}
                    >
                        {this.state.buttonText}
                    </button>
                </div>
            );
        }
    }
}
