const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const cors = require('cors')
const User = require('./models/user')
app.use(cors())

// For parsing application/json
app.use(express.json());
 
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/register',(req,res)=>{
    const {name,email,password,role} = req.body
    User.findOne({
        email : email
    })
    .then(data=>{
        if(!data){
            const newUser = new User({
                name,
                password,
                email,
                role
            })
            newUser.save()
            .then(data=>{
                res.json({
                    message : 'user registered',
                    data
                })
            })
            .catch(err => console.log(err))
        }
        else
        res.json({
            message : "User already exists. Please use a different email"
        })
    })





})

app.post('/login',(req,res)=>{
    const {email,password} = req.body
    User.findOne({
        email : email
    })
    .then(data=>{
        if(!data){
            res.json({
                message : "User does not exist. Please register first"
            })
        }
        else
        {
        if(password===data.password){
            res.json({
                data
            })
        }
        else{
            res.json({
                message : 'Incorrect Password'
            })
        }
        }
    })

})

app.listen(3001,()=>{
    console.log('Server running on port 3000')
    connectDB()
})