import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioEditor";
import { Link } from "react-router-dom";

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
            <div className="light-side">
                <BioEditor
                    first={props.first}
                    bio={props.bio}
                    setBio={props.setBio}
                />
                <Link className="friendlist-link" to="/friends">
                    Friend List
                </Link>
            </div>
        </div>
    );
}
