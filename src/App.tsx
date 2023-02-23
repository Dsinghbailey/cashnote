import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import WalletPage from "./components/WalletPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAccount } from "wagmi";
import ConnectPage from "./components/ConnectPage";
import HomePage from "./components/HomePage";
import SendingPage from "./components/SendingPage";
import TxnPage from "./components/TxnPage";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";

function App() {
  const { isConnected, address } = useAccount();
  return (
    <div className="flex flex-col float-left w-full h-full bg-gray-100">
      {/* body */}

      <BrowserRouter>
        {isConnected ? (
          <>
            <div className="flex flex-col min-h-[100vh] justify-between">
              <div className="flex flex-col">
                <NavBar />

                <Routes>
                  <Route path="/">
                    <Route index={true} element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="send" element={<HomePage />} />
                    <Route path="send/:searchPath" element={<SendingPage />} />
                    <Route path="wallet/:viewWallet" element={<WalletPage />} />
                    <Route
                      path="txn/:searchPath/sent"
                      element={<TxnPage txnSent={true} />}
                    />
                    <Route
                      path="txn/:searchPath"
                      element={<TxnPage txnSent={false} />}
                    />
                    <Route path="*" element={<HomePage />} />
                  </Route>
                </Routes>
              </div>
              <Footer />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col min-h-[100vh] justify-between">
              <div className="flex flex-col">
                <NavBar />
                <Routes>
                  <Route
                    path="txn/:searchPath"
                    element={<TxnPage txnSent={false} />}
                  />
                  <Route path="/wallet/undefined" element={<ConnectPage />} />
                  <Route path="wallet/:viewWallet" element={<WalletPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="*" element={<ConnectPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
