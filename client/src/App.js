// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import Home from './components/Home';
import ProductsList from './components/ProductsList';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element=<Home/>/>
        <Route path="/dashboard" element=<Dashboard/>/>
        <Route path="/productslist" element=<ProductsList/>/>
      </Routes>
    </Router>
  );
}

export default App;
