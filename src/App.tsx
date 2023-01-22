import React from "react";
import "./App.css"
import NavBar from "./components/NavBar";
import SendCard from "./components/SendCard";
import ViewCard from "./components/ViewCard";
import { useState } from "react";


function App() {
  const [appView, setAppView] = useState("send");
  return (
    <div className=" bg-blue h-full float-left w-full flex flex-col"> 
      {/* NavBar */}
      <NavBar appView={appView} setAppView={setAppView}/>
      {/* body */}
      {appView === "send" ? <SendCard /> : <ViewCard />}
      </div>
  );
}

export default App;
