import React, { useContext,useEffect } from 'react'
import { Loggedincontext } from '../context/context'
import axios from 'axios'
function Home() {
    const [isloggedin,setLogin]=useContext(Loggedincontext)
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
    },[])

    

  return (
 <div class="app-title">
  <div className='app-text'>Welcome To Accessories <br/><div> Arbitrage</div></div>
 </div>
  )
}

export default Home