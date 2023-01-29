import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-credential/config'
import { collection, query, where, getDocs,getDoc,doc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import axios from 'axios';
import "./Order.css"
import jwt from 'jwt-decode' // import dependency

const app=initializeApp(firebaseConfig)
const db = getFirestore(app)

function Order() {
  const {id}=useParams()
  const [data,setData]=useState([])
  const [address,setAddress]=useState("")
  const [name,setName]=useState("")
  const [phone,setPhone]=useState("")
    useEffect(()=>{
      let token=localStorage.getItem("token")
      if(token){
        axios.post("https://testphoneapi.ddns.net/verifier",{
          token:token
        }).then((response)=>{
          if(response.data.status!=="200"){
            window.location="/"
          }
        })
      }else{
        window.location="/"

      }
     async function dataFetch(){
        const docRef = doc(db, "mobilecovers", id);
        const docSnap = await getDoc(docRef);
        
        setData([docSnap.data()])
      }
      dataFetch()
    },[id])
    
  function addressHandler(element){
    setAddress(element.target.value)

  }
  function nameHandler(element){
    setName(element.target.value)
  }
  function phoneHandler(element){
    setPhone(element.target.value)
  }
  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

  async function checkoutHandler(){
    
      const docRef = doc(db, "mobilecovers", id);
      const docSnap = await getDoc(docRef);
      const dbData=docSnap.data()
      let price=docSnap.data().price
      price=parseInt(price,10)
      price=price*100
      
         
    
    


    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

 
  const sentdata={
    name:name,
    phone:phone,
    amount:price
  }
  const result = await axios.post("https://testphoneapi.ddns.net/order",sentdata);
  if (!result) {
    alert("Server error. Are you online?");
    return;
  }
  const { amount, id: order_id, currency } = result.data;

  const options = {
    key: "rzp_test_SAoxpzxwWtaIDu", // Enter the Key ID generated from the Dashboard
    amount: amount.toString(),
    currency: currency,
    name: "AccessoryArbitrage.",
    description: "Test Transaction",
    // image: { logo },
    order_id: order_id,
    handler: async function (response) {
      const token=localStorage.getItem("token")
      let decoded=jwt(token)
        const data = {
            username:decoded.username,
            model:dbData.model,
            price:dbData.price,
            address:address,
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post("https://testphoneapi.ddns.net/success", data);

        alert(result.data);
        window.location="/orderhistory"
    },
    prefill: {
        name: name,
        email: "SoumyaDey@example.com",
        contact: phone,
    },
    notes: {
        address: address,
    },
    theme: {
        color: "#61dafb",
    },
};

const paymentObject = new window.Razorpay(options);
paymentObject.open();


  }
  return (
    <div className='order-container'>
     
        {data.map((value)=> {
          return(
            <div className='product-container'>
            <div className='name'>{value.model}</div>
            <div className='price'>{value.price}</div>
            <img src={value.imageurl} className="image"/>
            </div>
          )
        }
        )}

        <div className='order-details-container'>
          <label htmlFor="name">Name</label>
          <input type="text" className='name' id='name' onChange={nameHandler} value={name} />
          
          <label htmlFor="address">Address</label>
          <input type="text" className='address' id='address' onChange={addressHandler} value={address} />
          
          <label htmlFor="phone">Phone</label>
          <input type="text" className='phone' id='phone' onChange={phoneHandler} value={phone} />


          <button className='button' onClick={checkoutHandler} >Checkout</button>
        </div>
      

    </div>
  )
}

export default Order