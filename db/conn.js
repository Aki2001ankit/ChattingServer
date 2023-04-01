const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DB = process.env.DATAHOUSE;
const ConnectDB = async() => {
    try {
        const conn = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,


        })
        console.log(`database connection : ${conn.connection.host}`)
    } catch (err) {
        console.log(`error:${err.message}`)
        process.exit()
    }

}
module.exports = ConnectDB;