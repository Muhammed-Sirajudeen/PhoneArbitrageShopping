import React, { useEffect,useState } from 'react'
import { getFirestore, QuerySnapshot } from "firebase/firestore"
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase-credential/config'
import { collection, getDocs } from "firebase/firestore";
import axios from 'axios';


const app=initializeApp(firebaseConfig)
const db = getFirestore(app)

 function Mobile() {
    let [productdata,setData]=useState([])
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
        getDocs(collection(db, "mobilecovers")).then((QuerySnapshot)=>{
            let proto=[]
            QuerySnapshot.forEach((doc)=>{
                let object=doc.data()
                object.id=doc.id
                proto.push(object)
            })
            setData(proto)
    
        })
    },[])
    console.log(productdata)

    let orderHandler=(element)=>{
        window.location="/order/"+element.target.id
    }
    
    return (
    <div className='products-container'>
        {productdata.map((data)=>{
            return (
           
                        <div className='product-main-container'>
                            <div className='product-name'>{data.model}</div>
                            <img src={data.imageurl} className="product-image"/>
                            <div className='price'>{data.price}</div>
                            <button className='buybutton' id={data.id} onClick={orderHandler}>Order</button>
                        </div>

            )
        })}
    </div>
  )
}

export default Mobile