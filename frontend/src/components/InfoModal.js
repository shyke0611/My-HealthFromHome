import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../assets/styles/infomodal.css";

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} scroll="paper">
      {/* Dialog Title */}
      <DialogTitle variant="h5" className="infoModal-title">
        Help Center
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers>
        {/* Disclaimer */}
        <Typography variant="body2" className="infoModal-disclaimer" paragraph>
          <strong>Disclaimer:</strong> My HealthFromHome is designed to assist you with health-related
          queries and therapy support. This service is not a replacement for professional medical
          advice, diagnosis, or treatment. Instead, it serves as a convenient way to gain initial
          insights and prepare for consultations with qualified healthcare providers. Always consult
          a professional for a thorough evaluation.
        </Typography>

        {/* Welcome Section */}
        <Typography variant="h6" className="infoModal-header">
          Welcome to My HealthFromHome!
        </Typography>
        <Typography variant="body1" className="infoModal-paragraph">
          Your personal AI-powered medical assistant and therapist, right at home! My HealthFromHome is
          here to make healthcare support more accessible, offering a convenient and efficient way
          to gain a clearer understanding of your concerns before seeking professional help.
        </Typography>

        {/* What is HealthFromHome? */}
        <Typography variant="h6" className="infoModal-header">
          What is My HealthFromHome?
        </Typography>
        <Typography variant="body1" className="infoModal-paragraph">
          My HealthFromHome is a complementary virtual assistant designed to:
        </Typography>
        <ul className="infoModal-list">
          <li>
            <Typography variant="body1">
              <strong>Answer Medical Questions:</strong> Gain preliminary insights into symptoms,
              treatment options, or general health advice.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Provide Therapy Support:</strong> Chat with an AI therapist to explore your
              thoughts and emotions in a confidential environment.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Simplify Access:</strong> Start sessions anytime, anywhere—no appointments or
              waiting rooms required.
            </Typography>
          </li>
        </ul>

        {/* How to Use HealthFromHome? */}
        <Typography variant="h6" className="infoModal-header">
          How to Use My HealthFromHome?
        </Typography>
        <ol className="infoModal-list">
          <li>
            <Typography variant="body1">
              <strong>Chat with Your AI Doctor/Therapist:</strong>{" "}
              <Link to="/chat" className="infoModal-link">
                Chat
              </Link>{" "}
              with your AI assistant to discuss symptoms, medications, mental health topics, or seek
              emotional support.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>View Summaries of Past Conversations:</strong> Access your past conversations
              in the{" "}
              <Link to="/summary" className="infoModal-link">
                Summary
              </Link>{" "}
              section to track your progress or prepare details to share with your healthcare
              provider.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Search and Export Chat History:</strong> Use the{" "}
              <Link to="/summary" className="infoModal-link">
                Summary
              </Link>{" "}
              feature to find specific topics or export chat summaries for professional discussions.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Receive Personalised AI Support:</strong> My HealthFromHome adapts to your needs
              by learning from your interactions, offering tailored advice to help you prepare for
              professional consultations.
            </Typography>
          </li>
        </ol>

        {/* Why Choose HealthFromHome? */}
        <Typography variant="h6" className="infoModal-header">
          Why Choose My HealthFromHome?
        </Typography>
        <ul className="infoModal-list">
          <li>
            <Typography variant="body1">
              <strong>Convenient Preparation for Professional Consultations:</strong> Use the{" "}
              <Link to="/summary" className="infoModal-link">
                Summary
              </Link>{" "}
              feature to compile relevant details, making it easier to communicate with your
              healthcare provider.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Instant Access:</strong> Get quick support when you need it, without waiting
              for appointments.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Privacy and Security:</strong> Your conversations are private, encrypted, and
              handled with care to ensure confidentiality.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Time-Saving and Cost-Effective:</strong> While HealthFromHome is not a
              replacement for professional care, it provides an affordable and accessible way to
              understand your concerns better before consulting a healthcare provider.
            </Typography>
          </li>
        </ul>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
