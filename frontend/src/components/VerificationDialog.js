import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import "../assets/styles/verificationDialog.css";

export default function VerificationDialog({ open, onClose, onVerify, onResend, email }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [resending, setResending] = useState(false);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    await onResend(email);
    setResending(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="verification-title">Enter Verification Code</DialogTitle>
      <DialogContent className="verification-content">
        <p className="verification-text">Account is not verified. A 6-digit code was sent to your email.</p>
        
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input-box"
              disabled={resending}
            />
          ))}
        </div>

        <div className="resend-section">
          <span className="resend-text">Didn't receive the code?</span>
          <button 
            className="resend-code"
            onClick={handleResendCode}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={resending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={otp.join("").length !== 6 || resending}>
         Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}
