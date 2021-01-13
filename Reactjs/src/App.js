import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Inbox from "./components/Inbox";
import Profile from "./components/Profile";
import Sent from "./components/Sent";
import Compose from "./components/Compose";
import SentView from "./components/SentView";
import InboxView from "./components/InboxView";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

const App = () => {

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * clear message when changing location
   */
  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  /**
   * logout 
   */
  const logOut = () => {
    dispatch(logout());
  };



  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Local Mailing System
          </Link>
          <div className="navbar-nav mr-auto">

            {currentUser && (
              <>
                <li className="nav-item">
                  <Link to={"/inbox"} className="nav-link">
                    Inbox
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/sent"} className="nav-link">
                    Sent
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/compose" className="nav-link">
                    compose
                  </a>
                </li>
              </>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.data.fullName}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/inbox" component={Inbox} />
            <Route exact path="/sent" component={Sent} />
            <Route exact path="/compose/:messageId?" component={Compose} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/sentview/:id" component={SentView} />
            <Route exact path="/inboxview/:id" component={InboxView} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;