import React from "react";
import Card from "./Card";
import Avatar from "./Avatar";
import { useEnsAvatar } from "wagmi";

export default function AboutPage() {
  const {
    data: avatarSrc,
    isError: avatarError,
    isLoading: avatarLoading,
  } = useEnsAvatar({
    address: "0x57632Ba9A844af0AB7d5cdf98b0056c8d87e3A85",
  });
  return (
    <>
      <div className="flex flex-col flex-wrap content-center justify-center mt-8">
        <div>
          <p className="text-2xl font-bold text-left">
            About Cashnote
            <br />
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <Card>
          <div className="flex flex-col flex-wrap content-center">
          <div className="flex items-center mb-4 overflow-auto rounded-xl">
            {!avatarLoading && !avatarError && avatarSrc && (
              <img src={avatarSrc as string} className="w-10 h-10 rounded-xl" />
            )}
            <div className="ml-2 italic text-gray-700 text-md">
              Heeroyuy.eth - Darian Bailey
            </div>
        </div>
            <p className="break-words text-md">
              Hi! This is a side project of mine. Thanks for checking it out!
              <br />
              <br />

              Cashnote is the new social payments crypto app that's aiming to
              become the Venmo of Web3. With Cashnote, you can send and receive
              payments easily and securely using cryptocurrencies and digital
              assets. But what sets us apart is our unique feature of attaching
              notes and comments to transactions. You can now add a personal
              touch to your payments by leaving messages for your frens, and all
              of these notes and comments are recorded on the blockchain for
              transparency and traceability.
              <br />
              <br />
              Cashnote also includes Ens names and avatars, so you can easily
              recognize which wallet you are messaging. Plus, our user-friendly
              interface makes it super easy to manage your account and view
              notes sent to you and your frens. Sending Notes on Cashnote is
              really fun and easy and we're confident it improves on the
              previous experience of sending notes on the blockchain (referenced
              in this{" "}
              <a
                href="https://ethereum.stackexchange.com/questions/2466/how-do-i-send-an-arbitary-message-to-an-ethereum-address/2469#2469"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                answer
              </a>
              ). We have no backend, no smart contracts, and no fees.
              <br />
              <br />
              Current plans for the future:
              <ul className="ml-4 list-disc">
                <li> Add layer 2 support</li>
                <li>More wallet information on profiles</li>
                <li> Go open source </li>
              </ul>
              <br />
              P.S. While you're here come check out <a href="https://nftychat.xyz" className="text-blue-700">nftychat.xyz</a>, a decentralized chat platform and my main project.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
