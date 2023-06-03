const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String, 
  password: String,
  email: String,
  role: String,
  address: String,
  messages: [
    {
        orderID : String,
        to : String,
        from : String,
        quantity : String,
        address: String,
        transporter: String,
        status: String,
        price : {
          type : Number,
          default: 0
        },
        createdAt: String,
        status: {
          type : String,
          enum: ["pending","accepted","rejected"],
          default: "pending"
        }
    }
  ],
});

const User = mongoose.model('User',userSchema)
module.exports = User