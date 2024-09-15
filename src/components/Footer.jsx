import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 flex-grow-3 mt-auto">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} ChatterVibe. All rights reserved.
                </p>
                <p className="text-sm mt-2">
                    <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> | 
                    <a href="/terms-of-service" className="hover:underline"> Terms of Service</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
