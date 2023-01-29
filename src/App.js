
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import { createContext } from 'react';
import { useState } from 'react';
import { Loggedinprovider } from './context/context';
import Mobile from './components/Mobile';
import Order from './components/Order';
import Orderhistory from './components/Orderhistory';
function App() {
  const [isloggedin,setLogin]=useState(false)
  return (
    <Loggedinprovider>
    <div className="App">
      
          <Layout/>
          <BrowserRouter>
      <Routes>
 
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />  
      <Route path="/mobilecover" element={<Mobile />} />  
      <Route path="/order/:id" element={<Order />} /> 
      <Route path="/orderhistory" element={<Orderhistory />} /> 

        
      </Routes>
    </BrowserRouter>
    
    </div>
    </Loggedinprovider>
   
    
    
  );
}

export default App;
