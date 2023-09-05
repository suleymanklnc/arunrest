import mongoose from "mongoose";


const conn = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName: "arunrest",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("connected to the DB arunrest succesfully")
    })
};


export default conn;