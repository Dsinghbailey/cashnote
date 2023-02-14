import React from "react";
import Logo from "../assets/logo-no-text.png";
import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar(props: any) {
  const isMobile = useMediaQuery({ query: `(max-width: 800px)` });
  const menuRef = useRef<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  });

  function handleClickOutside(event: any): void {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }

  return (
    <div className="flex flex-row flex-wrap justify-between float-left w-full bg-white align-center">
      <div className="inset-0 flex justify-start">
        <img src={Logo} className="my-4 ml-6 h-11" alt="logo" />
      </div>
      {isMobile ? (
        <div className="contents" ref={menuRef}>
          <button className="flex flex-row flex-wrap align-center">
            <Icon
              icon="ci:hamburger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-blue text-5xl my-auto mr-6 ${
                isMenuOpen ? "border-brown border" : ""
              }`}
            />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 z-10 flex justify-end mt-[4.75em]">
              <ul className="px-4 bg-white border border-brown">
                <li>
                  <div
                    className={`navbar__option `}
                    onClick={() => navigate("/send")}
                  >
                    <span
                      className={`navbar__option_span ${
                        location.pathname === "/send" ? "active" : ""
                      }`}
                    >
                      Send
                    </span>
                  </div>
                </li>
                <li className="mt-0">
                  <div
                    className={`navbar__option `}
                    onClick={() => navigate("/view")}
                  >
                    <span
                      className={`navbar__option_span ${
                        location.pathname === "/view" ? "active" : ""
                      }`}
                    >
                      View
                    </span>
                  </div>
                </li>
                <li className="pt-2 mt-2 mb-4 border-t border-grey border-t-soli">
                  <div className="flex flex-wrap content-center justify-end my-2 text-lg whitespace-nowrap">
                    <div className="mr-4">
                      <ConnectButton chainStatus="none" showBalance={false} />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-end flex-auto">
          <div className="flex justify-end mr-2 ">
            <div
              className={`navbar__option`}
              onClick={() => navigate("/send")}
            >
              <span
                className={`navbar__option_span ${
                  location.pathname === "/send" ? "active" : ""
                }`}
              >
                Send
              </span>
            </div>
            <div
              className={`navbar__option `}
              onClick={() => navigate("/view")}
            >
              <span
                className={`navbar__option_span ${
                  location.pathname === "/view" ? "active" : ""
                }`}
              >
                View
              </span>
            </div>
          </div>

          <div className="flex flex-wrap content-center justify-end my-2 text-lg whitespace-nowrap">
            <div className="mr-4">
              <ConnectButton chainStatus="none" showBalance={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
