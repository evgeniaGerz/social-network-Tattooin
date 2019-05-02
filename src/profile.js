import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./BioEditor";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function(props) {
    return (
        <div className="profile-container">
            <div className="dark-side">
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    users_pic={props.users_pic}
                    clickHandler={props.clickHandler}
                />
                <p className="user-name">
                    {props.first} <br />
                    {props.last}
                </p>
            </div>

            {/* ...props */}
            <div className="light-side">
                <BioEditor
                    first={props.first}
                    bio={props.bio}
                    setBio={props.setBio}
                />
                {/*<Link to="/welcome" className="logout-link">
                LOG OUT
            </Link>*/}
            </div>
        </div>
    );
}
