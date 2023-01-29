import React from "react";
import { createContext,useState } from "react";
export const Loggedincontext=createContext()

export const Loggedinprovider = (props)=>{
    const [isloggedin,setLogin]=useState("")

    return(
        <Loggedincontext.Provider value={[isloggedin,setLogin]}>
                {props.children}
        </Loggedincontext.Provider>
    )
}