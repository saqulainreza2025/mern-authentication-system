import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white h-160 flex items-center shadow-md">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to My Website
        </h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
          A simple, clean, and modern design to make your journey delightful.
        </p>
      </div>
    </header>
  );
};

export default Header;
