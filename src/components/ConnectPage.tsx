import React from "react";
import Card from "./Card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLocation } from "react-router-dom";
import SmallCard from "./SmallCard";

export default function ConnectPage(props: any) {
  const location = useLocation().pathname;

  return (
    <>
      <div className="pb-8 bg-blue-600">
        <Card>
          <p className="pb-6 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900">
            {location && ["/send", "/"].includes(location) ? (
              <>
                Social Payments <br />
                on the Blockchain.
              </>
            ) : (
              <>
                View your notes <br />
                and Eth transactions.
              </>
            )}
          </p>
          <div className="flex flex-wrap content-center justify-center mb-2 text-2xl text-center">
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        </Card>
      </div>
      <div className="pt-4">
        <p className="my-2 text-2xl font-bold tracking-tight text-center text-gray-700">
          Connect Your Wallet to See Your{" "}
          {location && ["/send", "/"].includes(location) ? "Friends" : "Notes"}
        </p>
        {location && ["/send", "/"].includes(location)
          ? 
          <div className="flex flex-wrap justify-center">
          {Array.from(Array(10).keys()).map((_: any) => (
              
                <SmallCard>
                  <div className="h-24 mx-auto my-4 italic text-center"></div>
                </SmallCard>

            ))}
            </div>
          : <div className="flex flex-col items-center">
          {Array.from(Array(10).keys()).map((_: any) => (
              
                <Card>
                  <div className="h-24 mx-auto my-4 italic text-center"></div>
                </Card>

            ))}
            </div>
            }
      </div>
    </>
  );
}
