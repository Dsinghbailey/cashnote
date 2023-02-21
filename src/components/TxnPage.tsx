import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTransaction } from "@wagmi/core";
import { useNavigate } from "react-router-dom";
import TxnCard from "./TxnCard";
import { useSigner } from "wagmi";
import { getEnsNames, shortenAddress } from "../utilities";


export default function TxnPage(props: any) {
  const navigate = useNavigate();

  const { searchPath } = useParams();
  const [txnHash, setTxnHash] = useState({});
  const [txData, setTxData] = useState<any>(null);
  const { data: signer } = useSigner();
  const [nameLookup, setNameLookup] = useState<any>({});
  function isValidTxHash(addr: string) {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }
  // use effect for navigating from url
  useEffect(() => {
    if (searchPath !== undefined && isValidTxHash(searchPath)) {
      setTxnHash(searchPath);
      fetchTransaction({
        hash: `0x${searchPath.slice(2)}`,
      }).then((transaction) => {
        let tempTransaction = {...transaction, ...{input: transaction.data}};
        setTxData(tempTransaction);
      });
    } else {
      setTxnHash("error");
    }
  }, [searchPath]);
  // useEffect for getting ensnames
  useEffect(() => {
    async function populateLookup() {
      if (txData === null || signer === null) {
        return;
      }
      // Get all addresses from transaction
      const addressesSet = new Set();
      addressesSet.add(txData.from);
      addressesSet.add(txData.to);
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
    populateLookup();
  }, [txData, signer]);

  // If there is an error with the entered tx hash don't show the form
  if (txnHash === "error") {
    return (
      <div className="flex flex-col flex-wrap content-center justify-center mt-8 mb-4 bg-gray-100">
        <p className="text-2xl font-bold text-left text-gray-700">
          There was an error with the entered transaction hash.
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
    <div>
      {/* Transaction Card */}
      {txData && <TxnCard tx={txData} nameLookup={nameLookup} />}
      {/* success message if just sent by user */}
      {props.txnSent && (
        <>
          <div className="flex flex-col flex-wrap content-center justify-center mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-700">
              Transaction sent successfully!
            </p>
            <button
              className="px-4 py-2 mx-auto my-4 text-xl font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </>
      )}
    </div>
  );
}
