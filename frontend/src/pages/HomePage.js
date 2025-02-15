import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import homepageAnimation from "../assets/animations/homepage.json";
import "../assets/styles/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Left Section: Title, Description, Buttons */}
      <div className="homepage-content">
        <h1 className="homepage-title">Your AI Health Companion, Instant Support from Home!</h1>
        <p className="homepage-description">
        Get instant medical insights and emotional support all from the comfort of home with <strong>My HealthFromHome</strong>.        </p>
        <div className="homepage-buttons">
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/chat"
            className="homepage-button"
          >
            Start Chatting
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="homepage-button"
          >
            Find Local Healthcare Services
          </Button>
        </div>
      </div>

      {/* Right Section: Animation */}
      <div className="homepage-animation">
        <Lottie animationData={homepageAnimation} />
      </div>
    </div>
  );
};

export default HomePage;
