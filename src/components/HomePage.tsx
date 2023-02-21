import React, { useEffect } from "react";
import SearchCard from "./SearchCard";
import { useAccount } from "wagmi";
import { useState } from "react";
import { getEnsNames, shortenAddress } from "../utilities";
import { useSigner } from "wagmi";
import FriendCard from "./FriendCard";
import SmallCard from "./SmallCard";


export interface Friend {
  address: string;
  name: string;
  timestamp: number;
}

export default function HomePage() {
  const { isConnected, address: wagmiAdress } = useAccount();
  const { data: signer } = useSigner();
  const [Friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
      if (isConnected && signer) {
        const url = `http://api.etherscan.io/api?module=account&action=txlist&address=${wagmiAdress}&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`;
        fetch(url)
          .then((response) => response.json())
          .then(async (data) => {
            if (Array.isArray(data.result)) {
              // Get addresses from data.result and the most recent timestamp
              let addressesObj: any = {};
              const tempTxns = data.result.slice(0, 1000);
              tempTxns.forEach((tx: any) => {
                if (!(tx.from in addressesObj)) {
                  addressesObj[tx.from] = tx.timeStamp;
                }
                if (!(tx.to in addressesObj)) {
                  addressesObj[tx.to] = tx.timeStamp;
                }
              });
              // Get ENS names from addresses
              const addresses = Object.keys(addressesObj);
              const ensNames = await getEnsNames(signer, addresses);
              let tempFriends: Friend[] = [];
              addresses.forEach((address: unknown, index: number ) => {
                address = String(address);
                if (wagmiAdress?.toLowerCase() === (address as string).toLowerCase()) {
                  return;
                }
                const ensName = ensNames[index];
                const userName =
                  (ensName === "" ? shortenAddress(address as string) : ensName);
                const tempFriend = {
                  address: address as string,
                  name: userName as string,
                  timestamp: addressesObj[address as string] as number,
                };
                tempFriends.push(tempFriend as Friend);
              });
              setFriends(tempFriends);
            } else {
              setFriends([]);
            }
          })
          .catch(() => {
            setFriends([]);
          });

      }
  }, [isConnected, signer, wagmiAdress]);
  
  return (
    <>
      <div className="pt-4 pb-8 bg-blue-600">
        <SearchCard />
      </div>
      <div className="pt-4 bg-gray-100">
        <p className="my-2 text-2xl font-bold tracking-tight text-center text-gray-700">
          Your Friends
        </p>
        <div className="flex flex-wrap justify-center">
        {Friends.map((friend) => (
          <div key={friend.address}>
          <FriendCard address={friend.address} name={friend.name} timestamp={friend.timestamp} />
          </div>
        ))}
        {Friends.length === 0 && (
                  <SmallCard>
                  <div className="mx-auto my-4 italic text-center">
                    No Transactions Found
                  </div>
                </SmallCard>
          )}
        </div>
      </div>
    </>
  );
}
