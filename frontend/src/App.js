import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import SummaryPage from "./pages/SummaryPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RequireAuth from "./components/RequireAuth";

const App = () => {
  console.log("App is rendering");

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />


            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
              <Route path="/summary" element={<Layout><SummaryPage /></Layout>} />
            </Route>
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
