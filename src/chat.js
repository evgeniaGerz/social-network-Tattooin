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
            let newChat = e.target.value;
            socket.emit("newChatMessages", newChat);
            e.target.value = "";
            console.log("myDiv: ", this.myDiv); // refers to the <div className="chat-container">
            this.myDiv.scroll = "1px solid black";
        }
    }

    // we need to find out when there's a new chat message
    componentDidUpdate() {
        this.myDiv.scrollTop = "100px";
    }

    render() {
        console.log("this.props in chat.js: ", this.props);
        if (!this.props.chatMessages) {
            return null;
        }
        return (
            <div className="chat-container">
                <h1>Chat</h1>
                <div
                    className="chat-container"
                    ref={chatsContainer => (this.myDiv = chatsContainer)}
                >
                    {this.props.chatMessages.map((message, i) => {
                        console.log("message: ", message);
                        return (
                            <div className="message-container" key={i}>
                                <div className="img-container">
                                    <img src={message.users_pic} />
                                </div>
                                <p>
                                    <strong>
                                        {message.first} {message.last}
                                    </strong>
                                    <br />
                                    {message.chat}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <textarea onKeyDown={this.handleInput} />
                <button type="button" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("state in chat's mapStateToProps:", state);

    return {
        chatMessages: state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
