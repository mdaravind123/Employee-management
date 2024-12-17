import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/route";

dotenv.config();

const port: string | number = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/employee", route);

app.listen(port, () => {
  console.log(`Port is listening at ${port}`);
});
