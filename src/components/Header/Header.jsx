import s from "../Header/Header.module.css";
import { NavLink } from "react-router-dom";
import ThemeToggleWrapper from "../Toggles/ThemeToggleWrapper";
import ThemeContext from "../Context";
import { useContext, useEffect, useState } from "react";
import Logo from "../Logo/Logo";
import React, { Component } from "react";

const Header = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const log = localStorage.getItem("userEmail");
  const [loginShow, setLoginshow] = useState(true);


  const showLogin = () => {
    setLoginshow((prevState) => !prevState);
  };
  return (

    <div
      className={s.header + " " + (themeMode ? s.header_light : s.header_dark)}
    >

      <Logo />
      {loginShow && log ? (
        <div
          className={themeMode ? s.header_light : s.header_dark}
          onMouseOver={() => showLogin()}
        >
          {log}
        </div>
      ) : (
        <NavLink
          to={"/Login"}
          className={(navData) => (navData.isActive ? s.active : "")}
        >
          Login
        </NavLink>
      )}
      <NavLink
        to={"/Test"}
        className={(navData) => (navData.isActive ? s.active : "")}
      >
        Test
      </NavLink>
      <NavLink
        to={"/News"}
        className={(navData) => (navData.isActive ? s.active : "")}
      >
        News
      </NavLink>
      <NavLink
        to={"/News2"}
        className={(navData) => (navData.isActive ? s.active : "")}
      >
        News2
      </NavLink>
      {/* <NavLink to={"/CV"}  className = { navData => navData.isActive ? s.active : "" }>CV</NavLink> */}
      <NavLink
        to={"/ChuckNorrisTalking"}
        className={(navData) => (navData.isActive ? s.active : "")}
      >
        ChuckNorrisTalking
      </NavLink>
      <ThemeToggleWrapper />
    </div>
  );
};

export default Header;
