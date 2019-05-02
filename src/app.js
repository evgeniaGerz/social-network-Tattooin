import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";
import BioEditor from "./bioEditor";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setBio = this.setBio.bind(this);
    }
    // is invoked immediately after a component is mounted
    componentDidMount() {
        console.log("mounted");
        axios.get("/user").then(({ data }) => {
            this.setState(data); // in state there will be a user id
        });
    }
    setBio(newBio) {
        this.setState({ bio: newBio });
    }
    render() {
        console.log("state in render: ", this.state);
        if (!this.state.id) {
            return null;
        }
        return (
            <div className="main-container">
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
                </div>
                <BrowserRouter>
                    <div className="browserRouter-container">
                        <Route
                            exact
                            path="/"
                            render={props => {
                                return (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        users_pic={this.state.users_pic}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                        clickHandler={() =>
                                            this.setState({
                                                isUploaderVisible: true
                                            })
                                        }
                                    />
                                );
                            }}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>

                {this.state.isUploaderVisible && (
                    <Uploader
                        setImage={users_pic => this.setState({ users_pic })}
                    />
                )}
            </div>
        );
    }
}
