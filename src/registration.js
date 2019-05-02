import React from "react";
import ReactDOM from "react-dom";
//import axios from "axios";
import axios from "./axios";
import { Link } from "react-router-dom";
import Error from "./error";

export default class Registration extends React.Component {
    // pop in the error message ("Smth went wrong")
    constructor(props) {
        super(props);
        // super allows to access the constructor method of the parent class
        // Use super(props), when nedd to access this.props in constructor
        //console.log("this.props in register: ", this.props); // component: "Registration"
        // passing or not passing props to super has no effect on later uses of this.props outside constructor.
        // That is render, shouldComponentUpdate, or event handlers always have access to it.

        // this will be updated after using an onInput event handleInput
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: ""
        };
        this.submit = this.submit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    handleInput(e) {
        // changes the value of state property and it's value
        this.setState({ [e.target.name]: e.target.value });
    }
    submit(e) {
        //ReactDOM.render(<Error />, document.querySelector(".error"));
        // to prevent the form from doing the post request on it's own
        e.preventDefault();
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(data => {
                console.log("data: ", data);
                if (data.success) {
                    location.replace("/"); // instead of redirecting
                } else {
                    //location.replace("/welcome");
                    console.log("something wrong?");
                }
                //location.replace("/");
            })
            .catch(err => {
                ReactDOM.render(<Error />, document.querySelector(".error"));
                console.log("Error in axios.post('/register): ", err);
            });
    }
    render() {
        return (
            <div>
                <form className="register-form">
                    <div className="dark-side">
                        <div className="logo">
                            <img
                                className="logo-small"
                                src="/img/logo.png"
                                width="30"
                                height="30"
                            />
                        </div>
                        <h2 className="register-h2">Welcome back</h2>
                        <p className="register-text">
                            To keep connected with us please login with your
                            personal info
                        </p>
                        <Link to="/login" className="login-link">
                            LOGIN
                        </Link>
                    </div>
                    <div className="light-side">
                        <h2>Create Account</h2>
                        <input
                            onInput={this.handleInput}
                            type="text"
                            name="first"
                            placeholder="First name"
                        />
                        <input
                            onInput={this.handleInput}
                            type="text"
                            name="last"
                            placeholder="Last name"
                        />
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
                            REGISTER
                        </button>
                        <Error error={this.state.error} />
                    </div>
                </form>
            </div>
        );
    }
}
