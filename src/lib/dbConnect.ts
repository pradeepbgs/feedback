import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

async function dbConnection() : Promise<void> {
    if (connection.isConnected) {
        console.log("already connected to DB")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');
    
        connection.isConnected = db.connections[0].readyState;
        console.log('DB Connected');
    } catch (error:any) {
        console.log('Mongoose connection error:', error)
        process.exit()
    }
}

export default dbConnection