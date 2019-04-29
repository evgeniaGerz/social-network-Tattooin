import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";
import Error from "./error";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        console.log("this.props in login: ", this.props);
        this.state = {
            email: "",
            password: "",
            error: ""
        };
        this.submit = this.submit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    handleInput(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    submit(e) {
        e.preventDefault();
        if (this.state.email != "" && this.state.password != "") {
            axios
                .post("login", {
                    email: this.state.email,
                    password: this.state.password
                })
                .then(data => {
                    console.log("data in post /login: ", data);
                    location.replace("/");
                })
                .catch(err => {
                    console.log("Error in axios.post('/login): ", err);
                });
        }
    }
    render() {
        return (
            <div>
                <form className="login-form">
                    <input
                        onInput={this.handleInput}
                        type="email"
                        name="email"
                        placeholder="email"
                    />
                    <input
                        onInput={this.handleInput}
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    <button onClick={this.submit} type="button">
                        Login
                    </button>
                    <Error error={this.state.error} />
                    <Link to="/welcome" className="logout-link">
                        Want to logout?
                    </Link>
                </form>
            </div>
        );
    }
}
