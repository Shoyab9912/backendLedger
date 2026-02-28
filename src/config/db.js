import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection successfull..");
  } catch (error) {
    console.error("DB coonection failed....", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected. Server shutting down.");
  process.exit(0);
});
