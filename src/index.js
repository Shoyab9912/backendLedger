import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "../.env",
});

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
