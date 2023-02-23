import React from "react";
import Logo from "../assets/logo-no-text.png";

export default function Footer() {
  return (
    <div className="flex flex-row px-20 pt-4 pb-8 mt-4 align-top bg-gray-200">
      <img src={Logo} className="h-8 mr-4" alt="logo" />
      <a href="/about" className="text-xl text-black appearance-none hover:text-blue-700">
        About
      </a>
    </div>
  );
}
