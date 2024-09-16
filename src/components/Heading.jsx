import { getAuth } from 'firebase/auth';
import React from 'react';
import { Link } from 'react-router-dom';
import { app } from '../config/firebase';

const Heading = () => {
    const auth = getAuth(app);

    const handleSignOutBtn = async () => {
        try {
            await auth.signOut();
            // Redirect to sign-in page or show a message if needed
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-blue-600 text-white py-4 px-6 shadow-md fixed top-0 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold">ChatterVibe</Link>
          <button
            onClick={handleSignOutBtn}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>
    );
}

export default Heading;
