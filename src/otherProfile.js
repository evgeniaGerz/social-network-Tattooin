import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditor from "./bioEditor";
//import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        //var self = this;
        console.log("this.props in OtherProfile: ", this.props);
        let id = this.props.match.params.id;

        axios.get("/user/" + id + "/anything").then(({ data }) => {
            if (data.redirect) {
                this.props.history.push("/");
            } else {
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    users_pic: data.users_pic,
                    bio: data.bio
                });
            }
        });
    }
    render() {
        return (
            <div className="otherProfile-container">
                <div className="dark-side">
                    <img
                        className="otherProfile-pic"
                        src={this.state.users_pic}
                    />
                    <p className="user-name">
                        {this.state.first} <br />
                        {this.state.last}
                    </p>
                </div>
                <div className="light-side">
                    <h2>
                        Profile of {this.state.first} {this.state.last}
                    </h2>
                    <p>{this.state.bio}</p>
                </div>
            </div>
        );
    }
}
