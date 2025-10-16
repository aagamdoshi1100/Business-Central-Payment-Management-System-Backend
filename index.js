import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/connectDB.js";
import serviceProviderRouter from "./routes/ServiceProvider.routes.js";
import userRouter from "./routes/User.routes.js";
import caseRouter from "./routes/Cases.routes.js";
connectDB();

const app = express();
app.use(express.json());
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
