import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
// } from "react-router-dom";
import "./App.css";

import SellerRegister from './pages/seller/register.js';
import CustomerRegister from './pages/customer/register';


function App() {
  return (
    <div className="App">
      <SellerRegister/>
      <CustomerRegister/>
    </div>
  );
}

export default App;