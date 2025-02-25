import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import SummaryPage from "./pages/SummaryPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  console.log("App is rendering");

  return (
    <Router>
      <Routes>
        {/* All routes use the Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignupPage />
            </Layout>
          }
        />
        <Route
          path="/chat"
          element={
            <Layout>
              <ChatPage />
            </Layout>
          }
        />
        <Route
          path="/summary"
          element={
            <Layout>
              <SummaryPage />
            </Layout>
          }
        />
        <Route path="/reset-password"
          element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
