const express=require('express')
const cors=require('cors')
const Razorpay = require("razorpay");
let crypto = require('crypto');
var admin = require("firebase-admin");
let jwt=require("jsonwebtoken")

var serviceAccount = require("./key.json");
const { write } = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db=admin.firestore()
const usersDb = db.collection('orderDetails');


function writeData(id,obj){
    usersDb.doc(id).set(obj).then((response)=>{
        console.log(response)
    }).catch(()=>{
        console.log("error occured")
    })


}

const app=express()
app.use(express.json({extended:true}));

app.use(cors())

app.post("/verifier",(req,res)=>{
    console.log(req.body)
    try{
    const verified = jwt.verify(req.body.token, 'secret');
    if(verified){
        res.json({status:"200"})
    }else{
        res.json({status:"403"})
    }
    }catch(error){
        res.json({status:"403"})
    }

})
app.post("/generator",(req,res)=>{
    console.log(req.body)
    const token = jwt.sign(req.body, 'secret',{expiresIn:"10000s"});
    res.json({token:token})
})
app.post("/order",async (req,res)=>{
    let postdata=req.body
    console.log(postdata)
   try{
    const instance = new Razorpay({
        key_id:"rzp_test_SAoxpzxwWtaIDu",
        key_secret:"gS0cv39uKHiiXBSL0AnPySNO"
    })

    var options = {
        amount: parseInt(req.body.amount),  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        let orders=order
        if(!orders){
            res.status(500).send("error")
        }else{
            res.json(orders)
        }
      });
    
  
   }catch(error){
    res.status(500).send(error);
   }

})
app.post("/success",async (req,res)=>{
    try{
        const {
            username,
            model,
            price,
            address,
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
        let hmac = crypto.createHmac('sha256', "gS0cv39uKHiiXBSL0AnPySNO");
        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generated_signature = hmac.digest('hex');
       


        if (generated_signature === razorpaySignature)
        {
            try{
            let retrieveRef=db.collection("orderDetails").doc(username)
            const response = await retrieveRef.get();
            
            if(response.data()){
                let data=response.data()
                let orders=JSON.parse(data.orders)
                let neworder={model:model,address:address,price:price}
                orders.push(neworder)
                let obj={
                    name:username,
                    orders:JSON.stringify(orders)
                }
                writeData(username,obj)
                res.send("success")

            }else{
               console.log("first order")
                let neworder={model:model,address:address,price:price}
                let obj={
                    name:username,
                    orders:JSON.stringify([neworder])
                }
                writeData(username,obj)
                res.send("success")


            }
            }catch(error){
                console.log(error)
            }
   

           
            

        }else{
            res.send("not successfull")
        }

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT



    }catch(error){
        res.status(500).send(error)

    }
})
const PORT=2000
app.listen(PORT,()=>  console.log(`created the server at ${PORT}`))