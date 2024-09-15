import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { app } from "../config/firebase";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
    const auth = getAuth(app);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here (e.g., Firebase auth)
    sendPasswordResetEmail(auth, email)
    alert("Password reset link sent to " + email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Find Your Account
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Please enter your email address to search for your account.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
