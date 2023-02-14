import React from "react";
import "./App.css"
import NavBar from "./components/NavBar";
import SendCard from "./components/SendCard";
import ViewCard from "./components/ViewCard";
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";


function App() {
  return (
    <div className="flex flex-col float-left w-full h-full bg-blue"> 
      {/* body */}
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/">
          <Route index={true} element={<SendCard/>} />
          <Route path="send" element={<SendCard />} />
          <Route path="view" element={<ViewCard />} />
          <Route path="*" element={<ViewCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </div>
  );
}

export default App;
