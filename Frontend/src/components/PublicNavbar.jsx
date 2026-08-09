import React from "react";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="glass flex justify-between items-center py-6 px-10 shadow-lg sticky top-0 z-40 border-b border-indigo-100/50 bg-white/80 backdrop-blur-md">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
        Telemed Connect
      </Link>
      <nav className="flex gap-8 text-lg font-medium items-center">
        <Link to="/" className="hover:text-indigo-600 transition-all hover:scale-110">Home</Link>
        <a href="/#services" className="hover:text-indigo-600 transition-all hover:scale-110">Services</a>
        <a href="/#about" className="hover:text-indigo-600 transition-all hover:scale-110">About Us</a>
        <a href="/#contact" className="hover:text-indigo-600 transition-all hover:scale-110">Contact</a>

        <Link to="/signup" className="hover:text-indigo-600 transition-all hover:scale-110">Sign Up</Link>
        <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-md hover:shadow-lg">
          Login
        </Link>
      </nav>
    </header>
  );
}
