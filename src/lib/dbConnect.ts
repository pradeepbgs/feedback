import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

async function dbConnection() : Promise<void> {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
    
        connection.isConnected = db.connections[0].readyState;
        console.log('DB Connected');
    } catch (error:any) {
        console.log('Mongoose connection error:', error)
        process.exit()
    }
}

export default dbConnection