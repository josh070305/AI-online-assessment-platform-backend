import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  await mongoose.connect(env.mongoUri);
  isConnected = true;
  console.log("MongoDB connected");
};
