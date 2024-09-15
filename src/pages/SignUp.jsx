import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app, db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const auth = getAuth(app);
  const usersRef = collection(db, "users");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmitBtn = async () => {
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const setUserData = await setDoc(doc(usersRef, user.user.uid), {
        fullName: fullName,
        password: password,
        email: email,
      });
        navigate("/sign-in");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            Chat with your friends in real time
          </h1>
          <p className="leading-relaxed mt-4">
            Join the fun and use this app to connect and chat with your friends!
            Dive into conversations, share your moments, and stay closer than
            ever. Don’t miss out on the opportunity to start chatting today
          </p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Sign Up
          </h2>
          <div className="relative mb-4">
            <label
              htmlFor="full-name"
              className="leading-7 text-sm text-gray-600"
            >
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              id="full-name"
              name="full-name"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            disabled={loading}
            onClick={handleSubmitBtn}
            className={`text-white ${
              loading ? "bg-indigo-300" : "bg-indigo-500"
            } border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <Link
            to={`/sign-in`}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mt-2 text-sm"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
