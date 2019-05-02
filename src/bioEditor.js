import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    // props should contain the user's current bio
    constructor(props) {
        super(props);
        this.state = {
            bio: props.bio || "",
            bioEditMode: false
        };
        this.changeBio = this.changeBio.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.switchToEditMode = this.switchToEditMode.bind(this);
    }
    handleInput(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    changeBio(e) {
        e.preventDefault();
        this.setState({ bioEditMode: false });
        console.log("bio edited");
        axios.post("/editBio", { bio: this.state.bio }).then(() => {
            this.props.setBio(this.state.bio);
        });
    }

    switchToEditMode() {
        this.setState({
            bioEditMode: true
        });
    }

    render() {
        //console.log("this.props: ", this.props);
        if (this.state.bioEditMode) {
            return (
                <div className="bioEditor-container">
                    <h2>Edit profile of {this.props.first}</h2>
                    <form>
                        <textarea
                            className="bio-field"
                            name="bio"
                            onChange={this.handleInput}
                            defaultValue={this.props.bio}
                            placeholder="Edit your bio"
                            rows="5"
                        />
                        <button onClick={this.changeBio} type="button">
                            SAVE
                        </button>
                    </form>
                </div>
            );
        }
        if (!this.props.bio) {
            return (
                <div className="bioEditor-container">
                    <h2>Tell us more about yourself</h2>
                    <button onClick={this.switchToEditMode} type="button">
                        ADD BIO
                    </button>
                </div>
            );
        } else {
            return (
                <div className="bioEditor-container">
                    <h2>Bio of {this.props.first}:</h2>
                    <p>{this.props.bio}</p>
                    <button onClick={this.switchToEditMode} type="button">
                        EDIT BIO
                    </button>
                </div>
            );
        }
    }
}
