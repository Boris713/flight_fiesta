import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
} from "../../firebase/auth";
import { useAuth } from "../../contexts/authContexts/authContexts";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const interestOptions = [
  { label: "Beaches", value: "beaches" },
  { label: "Urban environment", value: "urban_environment" },
  { label: "Museums", value: "museums" },
  { label: "Shops", value: "shops" },
  { label: "Tourist attractions", value: "tourist_object" },
  { label: "Natural", value: "natural" },
  { label: "Historical", value: "historic" },
  { label: "Cultural", value: "cultural" },
  { label: "Architecture", value: "architecture" },
  { label: "Amusements", value: "amusements" },
  { label: "Adult", value: "adult" },
  { label: "Religion", value: "religion" },
];

const Authentication = () => {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const navigate = useNavigate();

  const [logInEmail, setLogInEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [userId, setUserId] = useState(""); // Store the userId after registration

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, [currentUser]);

  const onSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(logInEmail, logInPassword);
        navigate("/home");
      } catch (err) {
        console.error(err);
        setIsSigningIn(false);
      }
    }
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        const credentials = await doCreateUserWithEmailAndPassword(
          registerEmail,
          registerPassword
        );
        const id = credentials.user.uid;
        const email = credentials.user.email;
        setUserId(id); // Store the userId for later use

        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, email }),
          }
        );

        if (response.ok) {
          setShowModal(true);
        } else {
          throw new Error("User registration failed");
        }
      } catch (err) {
        console.error(err);
        setIsSigningUp(false);
      }
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

  const handleInterestChange = (value) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleModalSubmit = async () => {
    if (selectedInterests.length < 4) {
      alert("Please select at least 4 interests.");
      return;
    }

    await fetch(
      `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/update-points`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedInterests.map((interest) => ({
            userId,
            category: interest,
            score: 10, // Assign any value for default points
          }))
        ),
      }
    );
    setShowModal(false);
    navigate("/home");
  };

  return (
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

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Your Interests</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  {interestOptions.map((interest) => (
                    <div className="form-check" key={interest.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={interest.value}
                        id={interest.value}
                        onChange={() => handleInterestChange(interest.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={interest.value}
                      >
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
