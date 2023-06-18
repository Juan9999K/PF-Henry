import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import style from "./navBar.module.css";
import logo from "../../imgAssets/logo_sin_texto.png";

const NavBar = () => {
    const history = useHistory();

    const logout = () => {
        history.push("/login");
    };

    return (
        <div className={style.navBar}>
            <NavLink to="/">
                <div className={style.logoContainer}>
                    <button className={style.logoBtn}>
                        <img src={logo} alt="logos" className={style.logo} />
                    </button>
                </div>
            </NavLink>

            <div className={style.linksContainer}>
                <NavLink
                    to="/create"
                    className={style.navLink}
                    style={(isActive) => ({
                        fontSize: isActive ? "28px" : "22px",
                        textDecoration: isActive ? "underline" : "none",
                    })}
                >
                    New Product
                </NavLink>

                <NavLink
                    to="/home"
                    className={style.navLink}
                    style={(isActive) => ({
                        fontSize: isActive ? "28px" : "22px",
                        textDecoration: isActive ? "underline" : "none",
                    })}
                >
                    Home
                </NavLink>

                <NavLink
                    to="/menu"
                    className={style.navLink}
                    style={(isActive) => ({
                        fontSize: isActive ? "28px" : "22px",
                        textDecoration: isActive ? "underline" : "none",
                    })}
                >
                    Menu
                </NavLink>

                <NavLink
                    to="/about"
                    className={style.navLink}
                    style={(isActive) => ({
                        fontSize: isActive ? "28px" : "22px",
                        textDecoration: isActive ? "underline" : "none",
                    })}
                >
                    About
                </NavLink>
            </div>
            <div className={style.logoutContainer}>
                <button onClick={logout} className={style.logout}>
                    LOGOUT
                </button>
            </div>
        </div>
    );
};

export default NavBar;