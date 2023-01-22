import React from "react";
import Logo from "../assets/logo-blue.svg";
import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef} from "react";


export default function NavBar(props: any) {
  const isMobile = useMediaQuery({ query: `(max-width: 800px)` });
  const menuRef = useRef<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  });

  function handleClickOutside(event: any): void{
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="bg-white float-left w-full justify-between align-center flex flex-row flex-wrap">
      <div className="flex justify-start inset-0">
        <img src={Logo} className="h-16 my-4 ml-6" alt="logo" />
      </div>
      {isMobile ? (
        <div className="contents" ref={menuRef}>
          <button className="flex align-center flex-row flex-wrap">
            <Icon
              icon="ci:hamburger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-blue text-5xl my-auto mr-6 ${isMenuOpen ?  "border-brown border" : ""}`}
            />
          </button>
          {isMenuOpen && (
          <div className="absolute flex justify-end mt-24 z-10 right-0">
            <ul className="bg-white p-4 border-brown border">
            <li className="mb-8">
                <div className="flex justify-end text-lg content-center flex-wrap whitespace-nowrap my-2">
                  <div className="mr-4">
                    <ConnectButton chainStatus="none" showBalance={false} />
                  </div>
                </div>
              </li>
              <li>
                <div
                  className={`navbar__option ${
                    props.appView === "send" ? "navbar__option_active" : ""
                  }`}
                  onClick={() => props.setAppView("send")}
                >
                  <span className="navbar__option_span">
                    <Icon icon="bi:send-fill" /> Send
                  </span>
                </div>
              </li>
              <li className="mt-6">
                <div
                  className={`navbar__option ${
                    props.appView === "view" ? "navbar__option_active" : ""
                  }`}
                  onClick={() => props.setAppView("view")}
                >
                  <span className="navbar__option_span">
                    <Icon
                      icon="fa6-solid:magnifying-glass"
                      className="flip-x"
                    />{" "}
                    View
                  </span>
                </div>
              </li> 
            </ul>
          </div>
          )}
        </div>
      ) : (
        <div className="flex flex-auto justify-end">
          <div
            className={`navbar__option ${
              props.appView === "send" ? "navbar__option_active" : ""
            }`}
            onClick={() => props.setAppView("send")}
          >
            <span className="navbar__option_span">
              <Icon icon="bi:send-fill" /> Send
            </span>
          </div>
          <div
            className={`navbar__option ${
              props.appView === "view" ? "navbar__option_active" : ""
            }`}
            onClick={() => props.setAppView("view")}
          >
            <span className="navbar__option_span">
              <Icon icon="fa6-solid:magnifying-glass" className="flip-x" /> View
            </span>
          </div>

          <div className="flex justify-end text-lg content-center flex-wrap whitespace-nowrap my-2">
            <div className="mr-4">
              <ConnectButton chainStatus="none" showBalance={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
