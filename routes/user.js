const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const uniqid = require('uniqid');
const ShortUniqueId = require('short-unique-id');



// get current date and time
let date_time = new Date();
let date = ("0" + date_time.getDate()).slice(-2);
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
let year = date_time.getFullYear();
let hours = date_time.getHours();
let minutes = date_time.getMinutes();
let seconds = date_time.getSeconds();
let dateAndTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds



router.get('/orders/:id',(req,res)=>{
const id = req.params.id
User.findOne({
    messages: {
        $elemMatch: {
            orderID: id
        }
    }
}).select({
    messages : {
        $elemMatch: {
            orderID: id
        }
    }
})
.then(data=>{
    // console.log(data)
    res.status(200).json(data.messages[0])
})
.catch(err=>console.log(err))
})


router.post('/getMessagebyOrderID',(req,res)=>{
    const {search} = req.body
    console.log('search ',search)
    User.findOne({
        messages: {
            $elemMatch: {
                orderID: search
            }
        }
    }).select({
        messages : {
            $elemMatch: {
                orderID: search
            }
        }
    })
    .then(data=>{
        console.log(data)
        res.send(data.messages[0])
    })
    .catch(err=>console.log(err))
})

router.post('/getMessagebyToAndFrom',(req,res)=>{
    const {to,from} = req.body
    console.log(to,from)
    User.find({
        messages: {
            $elemMatch: {
                to: to,
                from: from,
            }
        }
    }).select({
        messages : {
            $elemMatch: {
                to: to,
                from: from
            }
        }
    })
    .then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>console.log(err))
})





router.post('/getUser',(req,res)=>{
    const {email} = req.body
    User.findOne({
        email : email
    })
    .then(data=>res.json({
        data
    }))
    .catch(err=>console.log(err))
})

router.patch('/placeOrder',(req,res)=>{
 
 let {order,email} = req.body
 const uid = new ShortUniqueId({ length: 8 }); 
 order.orderID = uid()
 order.createdAt = dateAndTime
 
//  const query = {
//     messages : [
//         order
//     ]
//  }
if(email!=="transporter1@gmail.com")
email = "transporter1@gmail.com" 
User.findOneAndUpdate({email: email},
    {$push: { messages: order }}
    ,{
    new : true
})
.then(data=>{
    
    res.status(200).json(data)
})
.catch(err=>console.log(err))
})

router.patch('/sendPrice',(req,res)=>{
    console.log('send price called')
    console.log('req.body - ',req.body)
    const {orderDetails,cost} = req.body
    orderDetails.price = cost
    console.log('orderDetails - ',orderDetails)
    User.findOneAndUpdate({
        name : orderDetails.from
    },
    {$push: { messages: orderDetails }},
    {
        new: true
    }
    )
    .then(
        User.updateMany({
            'messages.orderID' : orderDetails.orderID
        },
        { $set: {
            'messages.$.price': cost, 
          }},
        {new: true
        }
        )
    )
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>console.log(err))
})


router.patch('/updateStatus',(req,res)=>{ 
    const {orderDetails,status} = req.body
    orderDetails.status = status
   
    User.updateMany({
        'messages.orderID' : orderDetails.orderID
    },
    { $set: {
        'messages.$.status': status, 
      }},
    {new: true
    }
    )
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        console.log(err)
    })
})



module.exports = router