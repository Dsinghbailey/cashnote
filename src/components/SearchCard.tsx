import React from "react";
import Card from "./Card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function SearchCard(props: any) {
  const [sendWallet, setSendWallet] = useState("");
  const [sendWalletError, setSendWalletError] = useState(false);
  const [pending, setPending] = useState("");
  const navigate = useNavigate();

  function clickBtn(btnName: string) {
    if (sendWallet === "") {
      setSendWalletError(true);
      return;
    }
    // Check if wallet is valid
    const url = `https://api.ensideas.com/ens/resolve/${sendWallet}`;
    setPending(btnName);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPending(btnName);
        if (data?.address) {
          if (btnName === "send"){
            navigate(`/send/${data?.address}`);
          } else {
            navigate(`/wallet/${data?.address}`);
          }
        } else {
          setPending("");
          setSendWalletError(true);
        }
      })
      .catch(() => {
        setPending("");
        setSendWalletError(true);
      });
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      clickBtn('send');
    }
  };
  return (
    <Card>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="pb-4 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900">
          Social Payments <br />
          on the Blockchain.
        </p>
        <div className="flex flex-col justify-start">
          <div className="h-12">
            <input
              className="w-full px-4 py-3 leading-tight bg-white border border-gray-400 rounded-xl shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline min-w-[280px] md:min-w-[320px] text-sm"
              placeholder="Public address(0x) or ENS name"
              value={sendWallet}
              onChange={(e) => {
                setSendWalletError(false);
                setSendWallet(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          {sendWalletError && (
            <p className="flex items-center ml-4 text-xs italic text-red-700 text-bottom ">
              <Icon icon="mdi:warning-circle-outline" className="mr-1" />
              Invalid address or ENS name
            </p>
          )}
        </div>
        <div className="flex flex-row items-center justify-center w-full h-full mt-4">
          <button
            className="px-6 py-1 mr-4 text-lg font-bold text-white bg-blue-600 rounded-lg right-1 top-1 hover:bg-blue-700 disabled:opacity-50"
            onClick={() => clickBtn('send')}
          >
            {pending === 'send' ? "Pending" : "Send"}
          </button>
          <button
            className="px-6 py-1 text-lg font-bold text-blue-600 bg-gray-100 border-blue-600 rounded-lg right-1 top-1 hover:bg-gray-200 disabled:opacity-50 border-1"
            onClick={() => clickBtn('view')}
          >
            {pending === 'view' ? "Pending" : "View"}
          </button>
        </div>
      </div>
    </Card>
  );
}
