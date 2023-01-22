import React from "react";
import { useState, useEffect} from "react";
import { Icon } from "@iconify/react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ViewCard() {
  const [viewWallet, setViewWallet] = useState("");
  const [txData, setTxData] = useState<any>(null)
  const { isConnected, address } = useAccount();

  // Get Transaction Data
  // Use effect to get Transactions after user finishes typing
  useEffect(() => {
    if (viewWallet === "") {
      return;
    }
    const walletTimer = setTimeout(() => {
      const url = `https://api.covalenthq.com/v1/1/address/${viewWallet}/transactions_v2/?key=ckey_f0b020a0d90542ebb15df1a393a`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
        })
        .catch(() => {
          setTxData("null")
        });
    }, 1000);
    return () => clearTimeout(walletTimer);
  }, [viewWallet]);


  return (
    <div className="bg-white py-6 my-12 md:my-16 mx-4 px-6 lg:px-8 border-solid border-4 border-blue rounded-lg ">
      <div className="flex justify-between mb-6 flex-wrap">
        <div className="min-w-[350px] w-5/12">
          <Icon
            icon="fa6-solid:magnifying-glass"
            className="flip-x absolute ml-4 text-xl mt-2"
          />
          <input
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 pl-12 py-2 pr-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Public address(0x) or ENS name"
            value={viewWallet}
            onChange={(e) => setViewWallet(e.target.value)}
          />
        </div>
        {!isConnected && (
          <div className="flex justify-center content-center flex-wrap text-2xl mt-4 mb-6 text-center">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        )}
        {isConnected && (
          <button
            className="bg-blue hover:bg-blue-dark text-white font-bold px-4 rounded"
            onClick={() => {
              if (address !== undefined) {
                setViewWallet(address);
              }
            }}
          >
            View My Txns
          </button>
        )}
      </div>
      <div className="flex justify-center content-center flex-wrap text-xl text-center">
        <table className="table-auto">
          <thead>
            <tr className="border-solid border-b-2 border-black">
              <th className="px-4 py-2">TxnHash</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      {!txData && (
          <div className="italic mx-auto text-center mt-6"> No Transactions Found </div>
        )}
    </div>
  );
}
