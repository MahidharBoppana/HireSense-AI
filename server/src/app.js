import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_URI,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/api/v1/healthCheck", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);



export default app;
