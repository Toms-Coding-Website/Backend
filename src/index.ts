import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/DBConnection";
import codeBlockRouter from "./routes/codeBlock.routes";
import CodeBlock from "./models/CodeBlock.model";

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/code-block", codeBlockRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  try {
    connectDB();
  } catch (error) {
    console.log("[server]: connection failed to MongoDB");
  }
  console.log(`Server is running at http://localhost:${port}`);
});
