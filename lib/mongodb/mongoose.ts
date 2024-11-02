import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "sanity",
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);

        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
