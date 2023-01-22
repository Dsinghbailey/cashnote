import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSigner, useAccount, useBalance } from "wagmi";
import { Icon } from "@iconify/react";

export default function SendCard() {
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
    <div className="bg-white py-6 my-12 md:my-16 mx-auto max-w-xl px-6 lg:px-8 border-solid border-4 border-blue rounded-lg min-w-[350px]">
      <div className="flex flex-col flex-wrap content-center">
        <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl pb-6">
          Send eth with a note
        </p>
        {isConnected ? (
          <>
            <div className="inline-block relative pb-6">
              <p className="text-xl">
                {" "}
                Send to *
                {sendWalletValid === "error" && (
                  <span className="text-red text-sm italic">
                    {" "}
                    Invalid address
                  </span>
                )}
              </p>
              <input
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Public address(0x) or ENS name"
                value={sendWallet}
                onChange={(e) => setSendWallet(e.target.value)}
              />
            </div>
            <div className="inline-block relative pb-6">
              <p className="text-xl"> Amount *
              {sendAmountValid === "error" && (
                  <span className="text-red text-sm italic">
                    {" "}
                    Insufficient funds
                  </span>
                )}
                </p>
              <div>
                <input
                  className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  placeholder=".01"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <span className="-ml-12">ETH</span>
              </div>
            </div>
            <div className="inline-block relative pb-8">
              <p className="text-xl"> Note</p>
              <textarea
                rows={4}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                placeholder="For the pizza party"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
              />
            </div>
            {txStatus === "" && (
              <>
              <button
                className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-2"
                disabled={!readyToSend}
                onClick={sendTransaction}
              >
                Send
              </button>
              <span className="italic text-sm text-center">* fields are required</span>
              </>
            )}
             {txStatus === "pending" && (
              <div
                className="bg-blue text-white font-bold py-2 px-4 rounded flex justify-center mb-2"
              >
                <Icon icon="tabler:loader-quarter" className="animate-spin text-2xl mr-2" />
                Pending... 
              </div>
            )}
            {txStatus === "success" && (
              <>
              <div
                className="bg-green text-white font-bold py-2 px-4 rounded flex justify-center mb-6"
              >
                <Icon icon="mdi:success-bold" className="text-xl mr-2" />
                Success!
              </div>
              <div className="flex justify-center">
              <a className="bg-grey rounded mb-2 p-2 cursor-pointer mx-2" 
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/tx/${txHash}`}
              > etherscan</a>
              <button className="bg-grey rounded mb-2 mx-2 p-2">share</button>
              </div>
              </>
            )}
            {txStatus === "error" && (
              <>
              <div
                className="bg-red text-white font-bold py-2 px-4 rounded flex justify-center align-middle mb-2"
              >
                <Icon icon="ic:sharp-error-outline" className="text-xl mr-2 mt-[2px]" />
                Error
              </div>
              <span className="italic text-sm text-center">There was a transaction errror. Please try again</span>
              </>
            )}
          </>
        ) : (
          <div className="flex justify-center content-center flex-wrap text-2xl mt-4 mb-6 text-center">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        )}
      </div>
    </div>
  );
}
