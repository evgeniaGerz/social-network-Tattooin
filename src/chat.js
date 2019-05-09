import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        if (e.which === 13) {
            console.log("e.target.value: ", e.target.value);
            var newChat = e.target.value;
            socket.emit("newChatMessage", newChat);
            console.log("myDiv: ", this.myDiv); // refers to the <div className="chat-container">
            this.myDiv.scroll = "1px solid black";
        }
    }

    // we need to find out when there's a new chat message
    componentDidUpdate() {
        this.myDiv.scrollTop = "100px";
    }

    render() {
        return (
            <div>
                <h1>Chat!</h1>
                <div
                    className="chat-container"
                    ref={chatsContainer => (this.myDiv = chatsContainer)}
                >
                    <p>my chats</p>
                    <p>my chats</p>
                    <p>my chats</p>
                    <p>my chats</p>
                </div>
                <textarea onKeyDown={this.handleInput} />
                <button type="button" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Chat);
