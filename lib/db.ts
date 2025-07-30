import mongoose from "mongoose";

interface Connection {
    isConnected?: number
}

const connection: Connection = {}

export async function connectDB() {
    if(connection.isConnected) {
        console.log("Already connected to DB")
        return 
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!)
    console.log("connected to DB")

    connection.isConnected = db.connections[0].readyState

}