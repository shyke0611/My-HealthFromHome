import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import icon from "../assets/images/icon.png";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh", 
        textAlign: "center" 
      }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Sorry, we could not find the page you are looking for.
      </Typography>

      <Box display="flex" gap={2}>
        {/* Go Back Button */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/", { replace: true })}
        >
          Go Back
        </Button>

        {/* Go to Home Page Button */}
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => navigate("/", { replace: true })}
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
