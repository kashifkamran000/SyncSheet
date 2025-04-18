import mongoose from "mongoose";


const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log('DB Connected !!');
    } catch (error) {
        console.log("Error while connecting to DB", error);
        throw error;   
    }
}

export default connectDB;