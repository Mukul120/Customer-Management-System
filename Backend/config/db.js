const mongoose = require("mongoose");


const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected SuccessFully");
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = ConnectDb;