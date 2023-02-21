import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import WalletPage from "./components/WalletPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAccount } from "wagmi";
import ConnectCard from "./components/ConnectCard";
import HomePage from "./components/HomePage";
import SendingPage from "./components/SendingPage";
import TxnPage from "./components/TxnPage";


function App() {
  const { isConnected, address } = useAccount();
  return (
    <div className="flex flex-col float-left w-full h-full bg-gray-100">
      {/* body */}

      <BrowserRouter>
        {isConnected ? (
          <>
            <NavBar />
            <Routes>
              <Route path="/">
                <Route index={true} element={<HomePage />} />
                <Route path="send" element={<HomePage />} />
                <Route path="send/:searchPath" element={<SendingPage />} />
                <Route path="wallet/:searchPath" element={<WalletPage />} />
                <Route path="txn/:searchPath/sent" element={<TxnPage txnSent={true} />} />
                <Route path="txn/:searchPath" element={<TxnPage txnSent={false} />} />
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </>
        ) : (
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <NavBar />
                  <div className="bg-blue-600">
                  <ConnectCard />
                  </div>
                </>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
