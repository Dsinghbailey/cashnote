import React from "react";
import SmallCard from "./SmallCard";
import Blockies from "react-blockies";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

const humanizeDuration = require("humanize-duration");

export default function FriendCard(props: any) {
  const navigate = useNavigate();
  return (
    <SmallCard>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-row items-center justify-between w-full h-full">
          <div 
           onClick={() => navigate("/wallet/" + props.address)}
          >
            <Avatar wallet={props.address} />
          </div>
          <div className="flex flex-col justify-center h-full">
            <button className="px-6 py-1 mb-2 text-lg font-bold text-white bg-blue-600 rounded right-1 top-1 hover:bg-blue-700 disabled:opacity-50"
                        onClick={() => navigate("/send/" + props.address)}
            >
              Send
            </button>
            <button 
            className="px-6 py-1 text-lg font-bold text-blue-600 bg-gray-200 border-blue-600 rounded right-1 top-1 hover:bg-gray-300 disabled:opacity-50 border-1"
            onClick={() => navigate("/wallet/" + props.address)}
            >
              View
            </button>
            
          </div>
        </div>
        <div className="flex flex-col w-full items-left">
          <p className="mt-2 text-2xl font-bold">{props.name}</p>
          <p className="text-sm italic text-grey-dark">
            Last transacted{" "}
            {humanizeDuration(
              (new Date().getTime() / 1000 - props.timestamp) * 1000,
              {
                largest: 1,
                round: true,
              }
            )}{" "}
            ago
          </p>
        </div>
      </div>
    </SmallCard>
  );
}
