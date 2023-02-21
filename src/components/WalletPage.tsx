import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { fetchTransaction } from "@wagmi/core";
import { useParams, useNavigate } from "react-router-dom";
import { getEnsNames, shortenAddress } from "../utilities";
import Card from "./Card";
import Blockies from "react-blockies";
import TxnCard from "./TxnCard";

export default function WalletPage(props: any) {
  let { searchPath } = useParams();
  const navigate = useNavigate();
  const [viewWallet, setViewWallet] = useState("");
  const [rawTxData, setRawTxData] = useState<any>(null);
  const [txData, setTxData] = useState<any>(null);
  const { address: wagmiAddress, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [nameLookup, setNameLookup] = useState<any>({});
  // Notes only toggle
  const [notesOnly, setNotesOnly] = useState(true);

  // fix for when wallet is undefined (happens right after user connects on view page)
  useEffect(() => {
    if (
      isConnected &&
      ["/view", "/view/undefined"].includes(searchPath as string)
    ) {
      navigate(`/view/${wagmiAddress}`);
    }
  }, [searchPath, isConnected, navigate, wagmiAddress]);

  // use effect for navigating from url
  useEffect(() => {
    if (searchPath !== undefined) {
      setViewWallet(searchPath);
    }
  }, [searchPath]);

  // helper to check whether valid transaction
  function isValidTxHash(addr: string) {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }
  // Get Transaction Data
  useEffect(() => {
    if (!ethers.utils.isAddress(viewWallet) && !isValidTxHash(viewWallet)) {
      return;
    }

    const searchterm = viewWallet;
    let url;
    if (isValidTxHash(searchterm)) {
      console.log("getting single txn for: ", viewWallet);
      setNotesOnly(false);
      fetchTransaction({
        hash: `0x${searchterm.slice(2)}`,
      }).then((transaction) => {
        console.log(transaction);
        setRawTxData([transaction]);
      });
    } else {
      console.log("getting tx data for: ", viewWallet);
      url = `https://api.etherscan.io/api?module=account&action=txlist&address=${searchterm}&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}&limit=100`;
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.result)) {
            setRawTxData(data.result.slice(0, 1000));
          } else {
            setRawTxData(null);
          }
        })
        .catch(() => {
          setTxData(null);
        });
    }
  }, [viewWallet]);

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

  function clickNotesToggle(value: boolean) {
    setTxData(null);
    setNotesOnly(value);
  }

  // Get Ens names from addresses
  // Use effect to get ENS names from addresses
  useEffect(() => {
    async function init() {
      console.log("Getting ENS names");

      if (rawTxData === null || signer === null) {
        return;
      }
      let addressesSet = new Set();
      rawTxData.forEach((tx: any) => {
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
    }
    if (rawTxData !== null && signer !== null && rawTxData.length > 0) {
      init();
    }
  }, [JSON.stringify(rawTxData), signer]);

  return (
    <>
      <div className="pb-4 bg-blue-600">
        <Card>
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-2xl font-bold">
              {" "}
              {Object.keys(nameLookup).length > 0
                ? nameLookup[viewWallet.toLowerCase()]
                : shortenAddress(viewWallet)}
            </p>
            <p className="mb-4 text-xs text-gray-400 ">{viewWallet}</p>

            <div className="flex items-center mb-2 overflow-auto rounded-xl">
              <Blockies
                seed={viewWallet?.toString().toLowerCase()}
                scale={11}
                size={8}
              />
            </div>

            <button
              className="px-6 py-1 mt-4 text-lg font-bold text-white bg-blue-600 rounded right-1 top-1 hover:bg-blue-700 disabled:opacity-50"
              onClick={() => navigate("/send/" + viewWallet)}
            >
              Send Eth
            </button>
          </div>
        </Card>
      </div>
      <div className="bg-gray-100">
        <div className="flex items-center justify-center my-8">
          <div className="shadow txn_type_toggle">
            <div
              className={`txn_type_toggle__option ${notesOnly ? "active" : ""}`}
              onClick={() => clickNotesToggle(true)}
            >
              Notes Only
            </div>
            <div
              className={`txn_type_toggle__option ${
                !notesOnly ? "active" : ""
              }`}
              onClick={() => clickNotesToggle(false)}
            >
              All Transactions
            </div>
          </div>
        </div>
        {txData &&
          txData.map((tx: any) => {
            return (
              <div key={tx.hash}>
                <TxnCard tx={tx} nameLookup={nameLookup} />
              </div>
            );
          })}

        {txData && txData.length === 0 && (
          <Card>
            <div className="mx-auto my-4 italic text-center">
              {notesOnly ? "No Notes Found" : "No Transactions Found"}{" "}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
