import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function ForgotPasswordDialog({ open, onClose, onSubmit, loading, errorMessage }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setEmail("");
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setSubmitting(true);
    await onSubmit(email);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={!submitting ? onClose : null} maxWidth="xs" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Enter your email address to receive a password reset link.
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <DialogActions>
            <Button onClick={onClose} disabled={submitting} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={submitting || !email}>
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
