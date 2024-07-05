import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./middlewares/connectDB.js";
import { productRoute } from "./routes/product.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

connectDB();
app.use("/api", productRoute);

app.listen(process.env.PORT, () => {
  console.log(`server running on PORT:${process.env.PORT}`);
});
