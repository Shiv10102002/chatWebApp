import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { DB_NAME } from "./constant.js";
import { dbInstance } from "./db/index.js";
import fs from "fs";
import { createServer } from "http";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { initializeSocketIO } from "./socket/index.js";
import requestIp from "request-ip";
import { errorHandler } from "./middleware/error.middlewares.js";
import morganMiddleware from "./logger/morgan.logger.js";
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

//global middleware
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
    credentials: true,
  })
);
app.use(requestIp.mw());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
app.use(morganMiddleware);

import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

app.get("/api/v1/init-socketio", (req, res) => {
  initializeSocketIO(io);
  res.status(200).json({
    data: {},
    success: true,
    message: "Socket.Io initialized successfully",
  });
});

// initializeSocketIO(io);
app.use(errorHandler);
export { httpServer };
