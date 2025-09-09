import React from "react";
import Home from "./pages/Home.jsx";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import ResetPasword from "./pages/ResetPasword.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="px-12">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/reset-password" element={<ResetPasword />} />
        <Route path="/email-verify" element={<EmailVerify />} />
      </Routes>
      //Toastify Notification
      <ToastContainer />
    </div>
  );
};

export default App;
