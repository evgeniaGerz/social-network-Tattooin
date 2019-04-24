import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Registration extends React.Component {
    // pop in the error message ("Smth went wrong")
    constructor(props) {
        super(props);
        // super allows to access the constructor method of the parent class
        // Use super(props), when nedd to access this.props in constructor
        console.log("this.props: ", this.props);
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
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(data => {
                console.log("data: ", data);
                //this.setState({
                //    error: true
                //})
                // if (data.sussess: true) {}
                location.replace("/"); // instead of redirecting
            })
            .catch(err => {
                console.log("Error in axios.post('/register): ", err);
            });
    }
    render() {
        const handleInput = e => {
            // changes the value of state property and it's value
            this.setState({ [e.target.name]: e.target.value });
        };
        // {"to ask Devid why not <button onClick={this.submit}"}
        return (
            <div>
                <form className="register-form">
                    {this.state.error && <div className="error">Oh noooo</div>}
                    <input
                        onInput={handleInput}
                        type="text"
                        name="first"
                        placeholder="First name"
                    />
                    <input
                        onInput={handleInput}
                        type="text"
                        name="last"
                        placeholder="Last name"
                    />
                    <input
                        onInput={handleInput}
                        type="email"
                        name="email"
                        placeholder="email"
                    />
                    <input
                        onInput={handleInput}
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    <button onClick={e => this.submit(e)} type="button">
                        Register
                    </button>
                    <p>
                        <a href="#">Proceed to login</a>
                    </p>
                </form>
            </div>
        );
    }
}
