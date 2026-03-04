import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middeleware.js";
import authRoutes from "./routes/auth.route.js";
import accountRoutes from "./routes/account.route.js";
import transactionRoutes from "./routes/transaction.route.js";

const app = express();

app.use(express.json({ limit: "2mb" }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorHandler);
export { app };
