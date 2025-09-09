import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between ">
      <div>
        <img src="logo.jpg" alt="Logo " className="w-[96px]" />
      </div>
      <div>
        <Link to="/login">
          <button className="text-xl border rounded-4xl px-4 py-1 cursor-pointer">
            Login ➡️
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
