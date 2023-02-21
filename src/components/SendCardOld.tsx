import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSigner, useAccount, useBalance } from "wagmi";
import { Icon } from "@iconify/react";
import Card from "./Card";

export default function SendPage() {
  const { isConnected, address } = useAccount();
  const [sendWallet, setSendWallet] = useState("");
  const [sendWalletValid, setSendWalletValid] = useState("");

  const [sendAmount, setSendAmount] = useState("");
  const { data: balance } = useBalance({address: address});
  const [sendAmountValid, setSendAmountValid] = useState("")

  const [sendNote, setSendNote] = useState("");
  const [readyToSend, setReadyToSend] = useState(false);
  const { data: signer } = useSigner();
  const [txStatus, setTxStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  // Check Wallet Valid
  // Use effect to check if the wallet is an ENS name or valid address after user finishes typing
  useEffect(() => {
    if (sendWallet === "") {
      setSendWalletValid("");
      return;
    }
    const walletTimer = setTimeout(() => {
      const url = `https://api.ensideas.com/ens/resolve/${sendWallet}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data?.address) {
            setSendWalletValid("true");
          } else {
            setSendWalletValid("error");
          }
        })
        .catch(() => {
          setSendWalletValid("error");
        });
    }, 1000);
    return () => clearTimeout(walletTimer);
  }, [sendWallet]);

  // Check Amount Valid
  // UseEffect to check if the amount is valid after user finishes typing
  useEffect(() => {
  if ((sendAmount === "") || balance === undefined) {
    setSendAmountValid("");
    return;
  }
  
  const amountTimer = setTimeout(() => {
    if (parseFloat(sendAmount) > parseFloat(String(balance?.formatted))) {
      setSendAmountValid("error");
    } else {
      setSendAmountValid("true");
    }
  }, 1000);
  return () => clearTimeout(amountTimer);
}, [sendAmount, balance]);

  // useEffect to check if all fields are filled out and valid
  useEffect(() => {
    if (
      sendWalletValid === "true" &&
      sendAmountValid === "true"
    ) {
      setReadyToSend(true);
    } else {
      setReadyToSend(false);
    }
  }, [sendWalletValid, sendAmountValid]);

  // Function to send Transaction
  function sendTransaction() {
    if (!signer) return;
    const transaction = {
      to: sendWallet,
      value: ethers.utils.parseEther(sendAmount),
      data: ethers.utils.toUtf8Bytes(sendNote),
    };
    setTxStatus('pending')
    signer
      .sendTransaction(transaction)
      .then((tx: any) => {
        console.log(tx);
        setTxStatus('success')
        setTxHash(tx?.hash)
      })
      .catch((error: any) => {
        console.log(error);
        setTxStatus('error')
      });
  }

  return (
    <Card>
      <div className="flex flex-col flex-wrap content-center">
        <p className="pb-6 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900 sm:2text-xl">
          Send eth with a note.
        </p>
        {isConnected ? (
          <>
            <div className="relative inline-block pb-6 min-w-[330px]">
              <p className="text-xl">
                {" "}
                Send to *
                {sendWalletValid === "error" && (
                  <span className="text-sm italic text-red">
                    {" "}
                    Invalid address
                  </span>
                )}
              </p>
              <input
                className="block w-full px-4 py-2 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline min-:"
                placeholder="Public address(0x) or ENS name"
                value={sendWallet}
                onChange={(e) => setSendWallet(e.target.value)}
              />
            </div>
            <div className="relative inline-block pb-6">
              <p className="text-xl"> Amount *
              {sendAmountValid === "error" && (
                  <span className="text-sm italic text-red">
                    {" "}
                    Insufficient funds
                  </span>
                )}
                </p>
              <div>
                <input
                  className="w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                  placeholder=".01"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <span className="-ml-12">ETH</span>
              </div>
            </div>
            <div className="relative inline-block pb-8">
              <p className="text-xl"> Note</p>
              <textarea
                rows={4}
                className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                placeholder="For the pizza party"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
              />
            </div>
            {txStatus === "" && (
              <>
              <button
                className="px-4 py-2 mb-2 text-xl font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={!readyToSend}
                onClick={sendTransaction}
              >
                Send
              </button>
              <span className="text-sm italic text-center">* fields are required</span>
              </>
            )}
             {txStatus === "pending" && (
              <div
                className="flex justify-center px-4 py-2 mb-2 text-xl font-bold text-white bg-blue-600 rounded"
              >
                <Icon icon="tabler:loader-quarter" className="mr-2 text-2xl animate-spin" />
                Pending... 
              </div>
            )}
            {txStatus === "success" && (
              <>
              <div
                className="flex justify-center px-4 py-2 mb-6 text-xl font-bold text-white rounded bg-green"
              >
                <Icon icon="mdi:success-bold" className="mr-2 text-xl" />
                Success!
              </div>
              <div className="flex justify-center">
              <a className="p-2 mx-2 mb-2 rounded cursor-pointer bg-grey" 
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/tx/${txHash}`}
              > etherscan</a>
              <button className="p-2 mx-2 mb-2 rounded bg-grey">share</button>
              </div>
              </>
            )}
            {txStatus === "error" && (
              <>
              <div
                className="flex justify-center px-4 py-2 mb-2 text-xl font-bold text-white align-middle rounded bg-red"
              >
                <Icon icon="ic:sharp-error-outline" className="text-xl mr-2 mt-[2px]" />
                Error
              </div>
              <span className="text-sm italic text-center">There was a transaction errror. Please try again</span>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-wrap content-center justify-center mt-4 mb-6 text-xl text-2xl text-center">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        )}
      </div>
    </Card>
  );
}
