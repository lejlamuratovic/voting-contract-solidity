import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ConnectPage, HomePage, AdminPage } from "./pages";

import "./App.css";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={ <ConnectPage /> } />
      <Route path="/home" element={ <HomePage /> } />
      <Route path="/admin" element={ <AdminPage /> } />
    </Routes> 
    </>
  )
}

export default App
