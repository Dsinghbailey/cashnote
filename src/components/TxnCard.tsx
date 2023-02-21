import React, { useEffect } from "react";
import Card from "./Card";
import { useState } from "react";
import Web3 from "web3";
import EtherscanLogo from "../assets/etherscan-logo-circle.svg";
import { ethers } from "ethers";
import { shortenAddress } from "../utilities";
import { createClient } from "@supabase/supabase-js";

const humanizeDuration = require("humanize-duration");


export default function TxnCard(props: any) {
  const [cleanInput, setCleanInput] = useState("");
  const [shareText, setShareText] = useState("share");
  

  useEffect(() => {
  if (props.tx.functionName && props.tx.functionName !== "") {
    setCleanInput("Contract Interaction");
  } else if (props.tx.Input !== "0x") {
    setCleanInput(Web3.utils.toAscii(props.tx.input));
  }
  }, [props.tx]);
  // copy to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText("https://cashnote.xyz/txn/" + text);
    setShareText("copied to clipboard!");
    setTimeout(() => {
      setShareText("share");
    }, 1500);
  }

  async function sendtoSupaBase(){
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL as string,
      process.env.REACT_APP_SUPABASE_KEY as string
    );
    const { error } = await supabase.from("sent_transaction").insert({ tx_hash: props.tx.hash, tx_data: JSON.stringify(props.tx), tx_amount: ethers.utils.formatEther(props.tx.value), tx_to:props.tx.to, tx_from:props.tx.from, tx_note: cleanInput });
    console.log(error)
  }

  return (
      <Card>
        <div className="flex flex-wrap text-lg break-all">
          <span className="font-semibold">{props.nameLookup[props.tx.from] || shortenAddress(props.tx.from)}</span>
          <span>&nbsp; paid &nbsp;</span>
          <span className="font-semibold">{props.nameLookup[props.tx.to] || shortenAddress(props.tx.to)}</span>
        </div>
        <div className="text-base text-gray-600 break-all">
          {ethers.utils.formatEther(props.tx.value).slice(0, 8)} Eth -{" "}
          {humanizeDuration(
            (new Date().getTime() / 1000 - props.tx.timeStamp) * 1000,
            {
              largest: 1,
              round: true,
            }
          )}{" "}
          ago
        </div>
        <div
          className={`pt-3 pb-4 text-lg break-all ${
            (props.tx.functionName && props.tx.functionName !== "") || cleanInput === ""
              ? "italic text-gray-300"
              : ""
          }`}
        >
          {cleanInput || "Empty Transaction"}
        </div>
        <div className="flex align-middle">
          <a
            className="mt-1 cursor-pointer"
            target="_blank"
            rel="noreferrer"
            href={`https://etherscan.io/tx/${props.tx.hash}`}
          >
            <img src={EtherscanLogo} className="h-4" alt="Etherscan" />
          </a>
          <button
            className="px-2 py-1 mx-2 text-xs text-gray-600 border-solid hover:text-black"
            onClick={() => copyToClipboard(props.tx.hash)}
          >
            {" "}
            [{shareText}]
          </button>
          <button
            className="px-2 py-1 mx-2 text-xs text-gray-600 border-solid hover:text-black"
            onClick={() => sendtoSupaBase()}
          >
            {" "}
            [supabase]
          </button>
        </div>
      </Card>
  );
}