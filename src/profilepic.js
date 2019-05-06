import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePic({ users_pic, first, last, clickHandler }) {
    return (
        <div>
            <div className="profilepic" onClick={clickHandler}>
                <img
                    src={users_pic || "/img/default.png"}
                    width="84"
                    height="84"
                    alt={first}
                />
            </div>
            <a className="logout-link" href="/logout">
                LOGOUT
            </a>
        </div>
    );
}
