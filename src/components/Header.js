import React, { useState, useEffect, useRef } from "react";
import "../css/Header.css";
import { Link } from "react-router-dom";
import { AiFillCaretDown, AiOutlineClose } from "react-icons/ai";
import { MdAccountCircle, MdExpandMore } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

import { logout } from "../service/auth";
import { AuthContext } from "../App";

import { useHistory, useLocation } from "react-router-dom";

const Header = ({ user }) => {
  const history = useHistory();
  const location = useLocation();
  const { dispatch } = React.useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuSide, setShowMenuSide] = useState(false);
  const drop = useRef(null);

  const onLogout = async () => {
    const res = await logout();
    history.push("/");
    dispatch({ type: "SET_USER" });
  };

  useEffect(() => {
    setShowMenu(false);
    setShowMenuSide(false);
  }, [location]);

  const handleClick = (e) => {
    if (!e.target.closest(`.${drop.current.className}`) && showMenu) {
      setShowMenu(false);
    }
  };

  return (
    <>
      <div id="header">
        <div id="left-navbar" className="navbar blue">
          <Link to="/" className="brand">
            KASHIO
          </Link>
          <div className="dropdown">
            <button type="button" className="dropdown-btn">
              Calculator
              <AiFillCaretDown className="caret-icon" />
            </button>
            <div className="dropdown-content display-none">
              <Link to="/" className="dropdown-link">
                Simple Calculator
              </Link>
              <hr />
              <Link to="/scientific-calculator" className="dropdown-link">
                Scientific Calculator
              </Link>
            </div>
          </div>
          <Link to="/unit-converter" className="link">
            Unit Converter
          </Link>
          {user.isAuthenticated && (
            <div className="dropdown">
              <button className="dropdown-btn">
                Randomizer
                <AiFillCaretDown className="caret-icon" />
              </button>
              <div className="dropdown-content display-none">
                <Link to="/team-generator" className="dropdown-link">
                  Team Generator
                </Link>
                <hr />
                <Link to="/name-picker" className="dropdown-link">
                  Name Picker
                </Link>
                <hr />
                <Link to="/yes-or-no" className="dropdown-link">
                  Yes or No
                </Link>
                <hr />
                <Link to="/decision-maker" className="dropdown-link">
                  Decision Maker
                </Link>
                <hr />
                <Link to="/random-picker" className="dropdown-link">
                  Random Picker
                </Link>
              </div>
            </div>
          )}
        </div>
        <div id="right-navbar" style={{ display: "flex" }}>
          {user.isAuthenticated ? (
            <div>
              <button
                type="button"
                ref={drop}
                className="dropdown-btn no-pr-navbar"
                onClick={() => setShowMenu((showMenu) => !showMenu)}
              >
                <MdAccountCircle className="account-icon" />
              </button>
              {showMenu && (
                <div className="account-content">
                  <Link to="/" className="dropdown-link">
                    {user.name}
                  </Link>
                  <hr />
                  <Link to="/" className="dropdown-link">
                    Save List
                  </Link>
                  <hr />
                  <Link onClick={onLogout} className="dropdown-link">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link to="/login" className="link">
                Login
              </Link>
              <Link to="/registration" className="link no-pr-navbar">
                Registration
              </Link>
            </div>
          )}

          <button
            type="button"
            id="menu-icon"
            className="dropdown-btn no-pr-navbar display-none"
            onClick={() => setShowMenuSide((showMenuSide) => !showMenuSide)}
          >
            <FiMenu className="menu-icon" />
          </button>
        </div>
      </div>

      {showMenuSide && (
        <div className="menu-side">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setShowMenuSide((showMenuSide) => !showMenuSide)}
          >
            <AiOutlineClose className="close-icon" />
          </button>
          <div className="menu-side-content">
            <div className="menu-dropdown">
              <button type="button" className="menu-side-btn">
                Calculator
                <MdExpandMore className="expand-icon" />
              </button>
              <div className="sub-menu display-none">
                <Link to="/" className="menu-side-link no-mt-menu-side">
                  Simple Calculator
                </Link>
                <Link to="/scientific-calculator" className="menu-side-link">
                  Scientific Calculator
                </Link>
              </div>
            </div>
            <hr />
            <Link to="/unit-converter" className="menu-side-link">
              Unit Converter
            </Link>
            <hr />
            {user.isAuthenticated ? (
              <div className="menu-dropdown">
                <button type="button" className="menu-side-btn">
                  Randomizer
                  <MdExpandMore className="expand-icon" />
                </button>
                <div className="sub-menu display-none">
                  <Link
                    to="/team-generator"
                    className="menu-side-link no-mt-menu-side"
                  >
                    Team Generator
                  </Link>

                  <Link
                    to="/name-picker"
                    className="menu-side-link no-mt-menu-side"
                  >
                    Name Picker
                  </Link>

                  <Link
                    to="/yes-or-no"
                    className="menu-side-link no-mt-menu-side"
                  >
                    Yes or No
                  </Link>

                  <Link
                    to="/decision-maker"
                    className="menu-side-link no-mt-menu-side"
                  >
                    Decision Maker
                  </Link>

                  <Link
                    to="/random-picker"
                    className="menu-side-link no-mt-menu-side"
                  >
                    Random Picker
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="menu-side-link">
                  Login
                </Link>
                <hr />
                <Link to="/registration" className="menu-side-link">
                  Registration
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
