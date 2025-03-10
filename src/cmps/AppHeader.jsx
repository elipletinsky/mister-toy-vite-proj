//const { Link, NavLink } = ReactRouterDOM
// const { useNavigate } = ReactRouter
// const { useSelector, useDispatch } = ReactRedux
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { userService } from "../services/user.service.js";
import { UserMsg } from "./UserMsg.jsx";
import { LoginSignup } from "./LoginSignup.jsx";
import { showErrorMsg } from "../services/event-bus.service.js";
import { login, signup, logout } from "../store/actions/user.actions.js";

export function AppHeader() {
  const navigate = useNavigate();
  const user = useSelector((storeState) => storeState.userModule.loggedInUser);
  function onLogout() {
    logout()
      .then(() => {
        showSuccessMsg("Logout successfully");
      })
      .catch((err) => {
        showErrorMsg("OOPs try again");
      });
  }

  function onSetUser(user) {
    //setUser(user)
    //onLogin(user)
    navigate("/");
  }

  return (
    <header className="app-header">
      <section className="header-container">
        <h1>React Toy App</h1>

        <nav className="app-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/toy">Toys</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
        {user ? (
          <section
            className="user-Info"
            style={{
              backgroundColor: user.backgroundColor,
              color: user.txtColor,
            }}
          >
            <h2>
              <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
            </h2>
            <span> balance {user.balance}</span>
            <button onClick={onLogout}>Logout</button>
          </section>
        ) : (
          <section>
            <LoginSignup />
          </section>
        )}
      </section>
      <UserMsg />
    </header>
  );
}
