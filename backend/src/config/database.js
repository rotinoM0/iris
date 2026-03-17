/* eslint-disable no-undef */
import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.mongoUri)
        console.log(`database conectada ${conn.connection.host}`);
        console.log(`database ${conn.connection.name}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

mongoose.connection.on("connected", () => {
    console.log("mongoose OK");
})

mongoose.connection.on("error", (err) => {
    console.error(err);
})

mongoose.connection.on("disconnected", () => {
    console.log("mongoose desconectado");
})

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("mongoose conexão fechada");
    process.exit(0);
})

export default connectDB;