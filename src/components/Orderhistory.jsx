import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import firebaseConfig from '../firebase-credential/config'
import { initializeApp } from 'firebase/app'
import { collection, query, where, getDocs,getDoc,doc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import jwt from "jwt-decode"
import "./Orderhistory.css"

const app=initializeApp(firebaseConfig)
const db = getFirestore(app)

function Orderhistory() {
    const [orderDetails,setOrderdetails]=useState([])
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
        let decoded=jwt(localStorage.getItem("token"))
        

        async function dataFetch(){
            const docRef = doc(db, "orderDetails", decoded.username);
            const docSnap = await getDoc(docRef);
            console.log(JSON.parse(docSnap.data().orders))
           setOrderdetails(JSON.parse(docSnap.data().orders)) 
           
          }
          dataFetch()

    },[])
  return (
    <div className='order-main-container'>
                {orderDetails.map((orders)=>{
            return(
            <div className='order-container'>
                <div className='model'> {orders.model} </div>
                <div className='price'> {orders.price} </div>
                <div className='address'>{orders.address}</div>
            </div>
            )
        })}
    </div>
  )
}

export default Orderhistory