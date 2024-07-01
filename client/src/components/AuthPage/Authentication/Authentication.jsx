import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
} from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContexts";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Authentication = () => {
  const { userLoggedIn } = useAuth; // will use in future to go straight to home page

  const [logInEmail, setLogInEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const onSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(logInEmail, logInPassword).catch(
        (err) => {
          isSigningIn(false);
        }
      );
    }
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      await doCreateUserWithEmailAndPassword(
        registerEmail,
        registerPassword
      ).catch((err) => {
        setIsSigningUp(false);
      });
    }
  };

  const onGoogleSignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
      });
    }
  };

  const handleTabClick = (tabName) => {
    if (tabName !== activeTab) {
      setActiveTab(tabName);
    }
  };

  return (
    //if user logged in redirect to home - add here
    <div className="container mt-5">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabClick("login")}
          >
            Login
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabClick("register")}
          >
            Register
          </a>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === "login" && (
          <div className="tab-pane fade show active">
            <form>
              <div className="form-group">
                <label htmlFor="loginEmail">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  value={logInEmail}
                  onChange={(e) => setLogInEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  value={logInPassword}
                  onChange={(e) => setLogInPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={onSignIn}
              >
                Sign In
              </button>
            </form>
          </div>
        )}
        {activeTab === "register" && (
          <div className="tab-pane fade show active">
            <form>
              <div className="form-group">
                <label htmlFor="registerEmail">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={onSignUp}
              >
                Register
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Authentication;
