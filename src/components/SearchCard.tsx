import React from "react";
import Card from "./Card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function SearchCard(props: any) {
  const [sendWallet, setSendWallet] = useState("");
  const [sendWalletError, setSendWalletError] = useState(false);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  function clickSend(){
    if (sendWallet === "") {
      setSendWalletError(true);
      return;
    }
    // Check if wallet is valid
    const url = `https://api.ensideas.com/ens/resolve/${sendWallet}`;
    setPending(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPending(false);
        if (data?.address) {
          navigate(`/send/${data?.address}`);
        } else {
          setSendWalletError(true);
        }
      })
      .catch(() => {
        setPending(false);
        setSendWalletError(true); 
      });
  }
  
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      clickSend();
    }
  };
  return (
    <Card>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="pb-6 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900">
          Send eth with a note <br />
          on the blockchain.
        </p>
        <div className="flex flex-col justify-start">
        <div className="relative min-w-[320px] h-12">
          <input
            className="absolute top-0 left-0 w-full px-4 py-3 leading-tight bg-white border border-gray-400 rounded-3xl shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline min-w-[320px] text-sm"
            placeholder="Public address(0x) or ENS name"
            value={sendWallet}
            onChange={(e) => {
              setSendWalletError(false);
              setSendWallet(e.target.value)}}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute z-10 px-2 py-1 mb-2 text-lg font-bold text-white bg-blue-600 right-1 top-1 rounded-3xl hover:bg-blue-700 disabled:opacity-50"
            onClick={clickSend}
          >
            {pending ? "Pending" : "Send" }
          </button>
        </div>
        {sendWalletError && (
          <p className="flex items-center ml-4 text-xs italic text-red-700 text-bottom ">
            <Icon icon="mdi:warning-circle-outline" className="mr-1" />
             Invalid address or ENS name
          </p>
        )}
        </div>
      </div>
    </Card>
  );
}
