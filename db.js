import mongoose from "mongoose";


const conn = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName: "lensLight_tr",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("connected to the DB succesfully")
    })
};


export default conn;