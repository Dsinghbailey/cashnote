import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAccount, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import Web3 from "web3";
import EtherscanLogo from "../assets/etherscan-logo-circle.svg";
import { fetchTransaction } from '@wagmi/core'
import { useParams } from 'react-router-dom';
import { getEnsNames, shortenAddress } from "../utilities";


const humanizeDuration = require("humanize-duration");

export default function ViewCard(props: any) {
  let { searchPath } = useParams(); 
  const { openConnectModal } = useConnectModal();
  const [viewWallet, setViewWallet] = useState("");
  const [rawTxData, setRawTxData] = useState<any>(null);
  const [txData, setTxData] = useState<any>(null);
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();
  const [nameLookup, setNameLookup] = useState<any>({});
  const [shareText, setShareText] = useState("share");

  // Notes only
  const [notesOnly, setNotesOnly] = useState(true);

  function isValidTxHash(addr: string) {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }
  // Get Transaction Data
  // Use effect to get Transactions after user finishes typing
  const searchNotes = useCallback((searchterm = viewWallet) => {
    console.log("searching: ", searchterm);
    if (searchterm === "") {
      return;
    }
    let url;
    if (isValidTxHash(searchterm)){
      setNotesOnly(false); 
      fetchTransaction({
        hash: `0x${searchterm.slice(2)}`,
      }).then((transaction) => {
        console.log(transaction);
        setRawTxData([transaction]);
      });
    }
    else{
      url = `https://api.etherscan.io/api?module=account&action=txlist&address=${searchterm}&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`;
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          setRawTxData(data.result);
        } else {
          setRawTxData(null);
        }
      })
      .catch(() => {
        setTxData(null);
      });
    }
  }, [viewWallet]);

  // use effect for navigating from url
  useEffect(() => {
    if (searchPath !== undefined) {
      setViewWallet(searchPath);
      searchNotes(searchPath);
    }
  }, [searchPath, searchNotes]);

  // Use effect to filter tx data
  useEffect(() => {
    if (rawTxData === null) {
      return;
    }
    let tempTxData = rawTxData;
    if (notesOnly) {
      tempTxData = tempTxData
        .filter((tx: any) => tx.input !== "0x")
        .filter((tx: any) => tx.functionName === "");
    }
    setTxData(tempTxData);
  }, [rawTxData, notesOnly]);

  // Get Ens names from addresses
  // Use effect to get ENS names from addresses
  useEffect(() => {
    async function init() {
      if (txData === null || signer === null) {
        return;
      }
      let addressesSet = new Set();
      txData.forEach((tx: any) => {
        addressesSet.add(tx.from);
        addressesSet.add(tx.to);
      });
      const addresses = Array.from(addressesSet);
      // Get ENS names from addresses
      const ensNames = await getEnsNames(signer, addresses);
      if (ensNames === null) {
        return;
      }
      let tempNameLookup: { [key: string]: string } = {};
      addresses.forEach(function (address: any, index: number) {
        const addressStr: string = address.toString();
        let userName = ensNames[index];
        // if ens name is empty, use abridged address
        if (userName === "") {
          userName = shortenAddress(addressStr);
        }
        tempNameLookup[addressStr] = userName;
      });
      setNameLookup(tempNameLookup);
      console.log(tempNameLookup);
    }
    init();
  }, [txData, signer]);

  // copy to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText('https://cashnote.xyz/view/' + text);
    setShareText("copied to clipboard");
    setTimeout(() => {
      setShareText("share");
    }, 1500);
  }

  return (
    <div className="bg-white py-6 my-12 md:my-16 mx-auto max-w-xl px-6 lg:px-8 border-solid border-4 border-blue-600 rounded-lg min-w-[350px] flex flex-col">
      <p className="pb-4 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900 sm:2text-xl">
        View notes by wallet or transaction.
      </p>
      <div className="flex flex-col flex-wrap content-center justify-center text-xl text-center">
        <div className="flex justify-between mb-2 min-w-[250px] w-full">
          <Icon
            icon="fa6-solid:magnifying-glass"
            className="absolute mt-2 ml-2 text-xl flip-x"
          />
          <input
            className="block w-full py-2 pl-8 pr-4 text-sm leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
            placeholder="Txn hash, public address(0x), or ENS name"
            value={viewWallet}
            onChange={(e) => setViewWallet(e.target.value)}
          />
        </div>
        <div className="flex justify-center mb-12">
          <button
            className="px-4 py-2 font-bold text-white bg-blue-600 rounded text-md hover:bg-blue-700 "
            onClick={() => searchNotes()}
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap justify-between float-none w-full m-0 align-middle border-b-2 border-solid border-grey">
          <div className=" txn_type_toggle">
            <div
              className={`txn_type_toggle__option ${notesOnly ? "active" : ""}`}
              onClick={() => setNotesOnly(true)}
            >
              Notes Only
            </div>
            <div
              className={`txn_type_toggle__option ${
                !notesOnly ? "active" : ""
              }`}
              onClick={() => setNotesOnly(false)}
            >
              All Transactions
            </div>
          </div>

          <button
            className="px-4 py-1 text-xs font-bold border-solid rounded bg-grey hover:bg-white border-t-grey-dark border-1 text-grey-dark hover:text-black"
            onClick={() => {
              if (!isConnected && openConnectModal) {
                openConnectModal();
              } else if (address !== undefined) {
                setViewWallet(address);
                searchNotes(address);
              }
            }}
          >
            {isConnected ? "View My Txns" : "Connect Wallet"}
          </button>
        </div>

        {txData &&
          txData.map((tx: any) => {
            let cleanInput = "";
            if (tx.functionName !== "") {
              cleanInput = "Contract Interaction";
            } else if (tx.Input !== "0x") {
              cleanInput = Web3.utils.toAscii(tx.input);
            }

            return (
              <div
                key={tx.hash}
                className="flex flex-col items-start text-left border-b-2 border-solid border-grey"
              >
                <div className="flex flex-wrap px-4 pt-4 text-lg break-all">
                  <span className="font-semibold">
                    {nameLookup[tx.from] || shortenAddress(tx.from)}
                  </span>
                  <span>&nbsp; paid &nbsp;</span>
                  <span className="font-semibold">
                    {nameLookup[tx.to] || shortenAddress(tx.to)}
                  </span>
                </div>
                <div className="px-4 text-base break-all text-grey-dark">
                  {ethers.utils.formatEther(tx.value)} Eth -{" "}
                  {humanizeDuration(
                    (new Date().getTime() / 1000 - tx.timeStamp) * 1000,
                    {
                      largest: 1,
                      round: true,
                    }
                  )}{" "}
                  ago
                </div>
                <div
                  className={`px-4 pt-2 pb-3 text-lg break-all ${
                    tx.functionName !== "" ? "italic text-grey" : ""
                  }`}
                >
                  {cleanInput}
                </div>
                <div className="flex px-4 pb-3 align-middle">
                  <a
                    className="mt-1 cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://etherscan.io/tx/${tx.hash}`}
                  >
                    <img src={EtherscanLogo} className="h-4" alt="Etherscan" />
                  </a>
                  <button className="px-2 py-1 mx-2 text-xs border-solid text-grey-dark hover:text-black"
                  onClick={() => copyToClipboard(tx.hash)}
                  > [{shareText}]</button>
                </div>
              </div>
            );
          })}
      </div>

      {(!txData || txData.length === 0) && (
        <div className="mx-auto mt-6 italic text-center">
          {" "}
          No Transactions Found{" "}
        </div>
      )}
    </div>
  );
}
