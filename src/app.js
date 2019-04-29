import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // is invoked immediately after a component is mounted
    componentDidMount() {
        console.log("mounted");
        axios.get("/user").then(({ data }) => {
            this.setState(data); // in state there will be a user id
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div className="header">
                <div className="logo">
                    <img src="/img/logo.png" width="70" height="70" />
                </div>
                <h1>TattooIn</h1>

                <ProfilePic
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    users_pic={this.state.users_pic}
                    clickHandler={() =>
                        this.setState({ isUploaderVisible: true })
                    }
                />

                {/*
                    <Profile
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        users_pic={this.state.image}
                        onClick={this.showUploader}
                        bio={this.state.bio}
                        setBio={this.setBio}
                    />
                */}

                {this.state.isUploaderVisible && (
                    <Uploader
                        setImage={users_pic => this.setState({ users_pic })}
                    />
                )}
            </div>
        );
    }
}
