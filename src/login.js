import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";
import Error from "./error";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
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
                    <div className="light-side">
                        <div className="logo">
                            <img
                                className="logo-small"
                                src="/img/logo.png"
                                width="30"
                                height="30"
                            />
                        </div>
                        <h2>Login to TattooIn</h2>
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
                            SIGN IN
                        </button>
                    </div>
                    <div className="dark-side">
                        <h2>Hello, Friend!</h2>
                        <p>
                            Enter your personal details and start journey with
                            us
                        </p>
                        <Link to="/" className="login-link">
                            REGISTER
                        </Link>
                    </div>
                    <Error error={this.state.error} />
                </form>
            </div>
        );
    }
}
