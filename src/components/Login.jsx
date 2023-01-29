import React from 'react'
import { useState ,useEffect,useRef,useContext} from 'react'
import firebaseConfig from '../firebase-credential/config'
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import { Loggedincontext } from '../context/context';
import { getFirestore, doc, setDoc ,getDoc,collection, query, where, getDocs } from "firebase/firestore"
import axios from 'axios';

function Login() {
    const [isloggedin,setLogin]=useContext(Loggedincontext)
    
    const app=useRef("");
    const db=useRef("")

    useEffect(()=>{
        let token=localStorage.getItem("token")
        if(token){
          axios.post("https://testphoneapi.ddns.net/verifier",{
            token:token
          }).then((response)=>{
            if(response.data.status==="200"){
              window.location="/home"
            }
          })
        }
        app.current=initializeApp(firebaseConfig)
        db.current=getFirestore(app.current)

        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier('submit-button', {
    'size': 'invisible',
    'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log("success")
    }
        }, auth);
        
    },[])
    

    const [username,Setusername]=useState("")
    const [phonenumber,setNumber]=useState("+91")
    const [otp,setOtp]=useState("")
    let EXIST_FLAG=false
    function otpSender(){
        const auth = getAuth();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phonenumber.toString(), appVerifier)
        .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
        console.log(error)
    });

    }

    function phoneHandler(element){
        setNumber(element.target.value)

    }
    function otpHandler(element){
        setOtp(element.target.value)
    }
    async function submit(){
       let usernamedata=username
        const docRef = doc(db.current, "username", usernamedata);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()!==undefined) {
            let userData= docSnap.data();
            EXIST_FLAG=true
            let retrUsername=userData.username
            let retrPhonenumber=userData.phonenumber
            if(retrPhonenumber===phonenumber && retrUsername===username){
                otpSender()
            }
            else{
                alert("the given username and phone number doesnt match")
            }
            



        } else {

            alert("the user does not exist")



            otpSender()
        }

    }
    function submitOtp(element){
        element.preventDefault()
        
     
        window.confirmationResult.confirm(otp).then(async ()=> {
            
            if(EXIST_FLAG===false){
                await setDoc(doc(db.current, "username", username), {
                    username:username,
                    phonenumber:phonenumber
                  });
                  const docRef = doc(db.current, "username", username);
                  const docSnap = await getDoc(docRef);
                  let userData=docSnap.data()
                  axios.post("https://testphoneapi.ddns.net/generator",{
                    username:userData.username
                  }).then((response)=>{
                    console.log(response.data)
                    localStorage.setItem("token",response.data.token)
                    window.location="/home"
                  })
                 

    
            }else{
                const docRef = doc(db.current, "username", username);
                const docSnap = await getDoc(docRef);
                
                let userData=docSnap.data()
                axios.post("https://testphoneapi.ddns.net/generator",{
                    username:userData.username
                  }).then((response)=>{
                    console.log(response.data)
                    localStorage.setItem("token",response.data.token)
                    window.location="/home"
                  })
                 
            }
            
           
            
        })
        .catch((error)=> alert("invalid otp"))
    }
    function usernameHandler(element){
        Setusername(element.target.value)
    }

  return (
    <div className='login-container'>
        <div className='login-main-container'>
        {isloggedin }
           
            <input type="username" id="phonenumber" onChange={usernameHandler} value={username} placeholder="enter the username"/>
            <input type="text" id='phonenumber' onChange={phoneHandler} value={phonenumber}   placeholder='enter phone number'/>
            <input type="number" id="otp" onChange={otpHandler} value={otp}  placeholder='enter otp'/>
            <button id='submit-button'  onClick={submit}>get otp</button>
            <button id='submit-otp-button'  onClick={submitOtp}>Verify Otp</button>
        </div>
    </div>
  )
}

export default Login