import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSigner, useAccount, useBalance } from "wagmi";
import { Icon } from "@iconify/react";
import SmallCard from "./SmallCard";
import { useNavigate, useParams } from "react-router-dom";
import { shortenAddress } from "../utilities";
import { createClient } from "@supabase/supabase-js";
import Avatar from "./Avatar";

export default function SendingPage() {
  const navigate = useNavigate();
  const { searchPath } = useParams();
  const { address } = useAccount();
  const [sendWallet, setSendWallet] = useState("");

  const [userName, setUserName] = useState(
    shortenAddress(searchPath as string)
  );

  const [sendAmount, setSendAmount] = useState("");
  const { data: balance } = useBalance({ address: address });
  const [sendAmountError, setSendAmountError] = useState("");

  const [sendNote, setSendNote] = useState("");
  const { data: signer } = useSigner();
  const [txStatus, setTxStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [sentTx, setSentTx] = useState({});

  // set username
  useEffect(() => {
    const url = `https://api.ensideas.com/ens/resolve/${searchPath}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data?.address) {
          setSendWallet(data?.address);
          setUserName(data?.displayName);
        } else {
          setUserName("error");
        }
      })
      .catch(() => {
        setUserName("error");
      });
  }, [searchPath]);

  // Function to send Transaction
  function sendTransaction() {
    if (balance === undefined) {
      setSendAmountError("*error fetching balance");
    } else if (sendAmount === "") {
      setSendAmountError("*required");
      return;
    }
    // Check if amount is number
    else if (isNaN(parseFloat(sendAmount))) {
      setSendAmountError("*must be a number");
      return;
    }
    // Check if amount is greater than balance
    else if (parseFloat(sendAmount) > parseFloat(String(balance?.formatted))) {
      setSendAmountError("*insufficient funds");
      return;
    }
    if (!signer) return;
    const transaction = {
      to: sendWallet,
      value: ethers.utils.parseEther(sendAmount),
      data: ethers.utils.toUtf8Bytes(sendNote),
    };
    setTxStatus("pending");
    signer
      .sendTransaction(transaction)
      .then((tx: any) => {
        console.log(tx);
        setTxStatus("success");
        setTxHash(tx?.hash);
        setSentTx(tx);
      })
      .catch((error: any) => {
        console.log(error);
        setTxStatus("error");
      });
  }
   // if transaction was a success show the success page
   useEffect(() => {
    if (txStatus === "success") {
      // Send Logs to supabase
      const supabase = createClient(
        process.env.REACT_APP_SUPABASE_URL as string,
        process.env.REACT_APP_SUPABASE_KEY as string
      );
      supabase
        .from("sent_transaction")
        .insert({
          tx_hash: txHash,
          tx_data: JSON.stringify(sentTx),
          tx_amount: sendAmount,
          tx_to: sendWallet,
          tx_from: address,
          tx_note: sendNote,
        })
        .then(() => {
          navigate(`/txn/${txHash}/sent`);
        });
    }
  }, [txStatus, txHash, sentTx, sendAmount, sendWallet, address, sendNote]);


  // If there is an error with the entered address don't show the form
  if (userName === "error") {
    return (
      <div className="flex flex-col flex-wrap content-center justify-center mt-8 mb-4">
        <p className="text-2xl font-bold text-left">
          There was an error with the entered address.
        </p>
        <button
          className="px-4 py-2 mx-auto my-4 text-xl font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-wrap content-start justify-center mt-8 mb-4">
        <div className="flex items-center overflow-auto rounded-xl">
        <a href={`/wallet/${searchPath}`} className="appearance-none cursor-pointer">
          <Avatar wallet={searchPath} />
          </a>
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-left">
            Sending to <br />
            <a href={`/wallet/${searchPath}`} className="appearance-none cursor-pointer"> {userName} </a>
          </p>

        </div>
      </div>
      <div className="flex justify-center">
        <SmallCard>
          <div className="flex flex-col flex-wrap content-center">
            <div className="relative inline-block pb-4 ">
              <p className="text-xl">
                {" "}
                Amount{" "}
                <span className="ml-1 text-sm italic text-red-800">
                  {sendAmountError}
                </span>
              </p>
              <div>
                <input
                  className="w-full px-4 py-2 pr-8 my-1 leading-tight bg-white border border-gray-400 rounded appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
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
                className="block w-full px-4 py-2 pr-8 my-1 leading-tight bg-white border border-gray-400 rounded appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                placeholder="For the pizza party"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
              />
            </div>
            {txStatus === "" && (
              <>
                <button
                  className="px-4 py-2 mb-2 text-xl font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={sendTransaction}
                >
                  Send
                </button>
              </>
            )}
            {txStatus === "pending" && (
              <div className="flex justify-center px-4 py-2 mb-2 text-xl font-bold text-white bg-blue-600 rounded">
                <Icon
                  icon="tabler:loader-quarter"
                  className="mr-2 text-2xl animate-spin"
                />
                Pending...
              </div>
            )}
            {txStatus === "error" && (
              <>
                <div
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center px-4 py-2 mx-auto mb-2 text-xl font-bold text-white bg-red-700 rounded cursor-pointer hover:bg-red-800"
                >
                  <Icon
                    icon="mdi:warning-circle-outline"
                    className="text-xl mr-2 mt-[2px]"
                  />
                  Try Again
                </div>
                <span className="text-sm italic text-center">
                  There was a transaction error. Please try again
                </span>
              </>
            )}
          </div>
        </SmallCard>
      </div>
    </>
  );
}
