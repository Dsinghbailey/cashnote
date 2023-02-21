import React from "react";
import Card from "./Card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLocation } from "react-router-dom";


export default function ConnectCard(props: any) {
  const location = useLocation().pathname;
  
  return (
    <Card>
      <p className="pb-6 mt-2 text-2xl font-bold tracking-tight text-center text-gray-900">
	{ (location && ["/send", "/"].includes(location)) ?
	(<>
	Send eth with a note <br />
        on the blockchain.
	</>) :
	(<>
	View your notes <br />
        and Eth transactions.
	</>)}
      </p>
      <div className="flex flex-wrap content-center justify-center mb-2 text-2xl text-center">
        <ConnectButton chainStatus="none" showBalance={false} />
      </div>
    </Card>
  );
}
