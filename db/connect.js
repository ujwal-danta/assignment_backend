const mongoose = require('mongoose')
require('dotenv').config()


const connectDB = async () => {
try {
    await mongoose.connect(process.env.MONGOURL);
    console.log('DB CONNECTED')
} catch (error) {
    console.log(error)
}
}

module.exports = connectDB