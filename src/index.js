import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!", error);
    process.exit(1);
  });
