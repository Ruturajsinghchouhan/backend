import mongoose from "mongoose";

const url = "mongodb+srv://crituraj008:siyaram.@cluster0.xhg7ggs.mongodb.net/travel-ai?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url);

console.log("Database connected successfully");