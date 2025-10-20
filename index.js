import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import connectDB from "./config/connectDB.js";
import serviceProviderRouter from "./routes/ServiceProvider.routes.js";
import userRouter from "./routes/User.routes.js";
import caseRouter from "./routes/Cases.routes.js";
import paymentRouter from "./routes/Payment.routes.js";
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/service-provider", serviceProviderRouter);
app.use("/cases", caseRouter);
app.use("/user", userRouter);
app.use("/payment", paymentRouter);
