import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import connectDB from "./config/DBConnection";
import codeBlockRouter from "./routes/codeBlock.routes";
import createSocketServer from "./socket";

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/code-block", codeBlockRouter);

// Base test route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Create an HTTP server to use with Socket.IO
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = createSocketServer(httpServer);

// Start the server
httpServer.listen(port, () => {
  try {
    connectDB();
  } catch (error) {
    console.log("[server]: connection failed to MongoDB");
  }
  console.log(`Server is running at http://localhost:${port}`);
});
