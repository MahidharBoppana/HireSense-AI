import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://hire-sense-ai-tau.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
import userRouter from "./routes/user.routes.js";
import superAdminRouter from "./routes/superAdmin.routes.js";
import adminRouter from "./routes/admin.routes.js";
import jobRouter from "./routes/job.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/super-admin", superAdminRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/recruiter", recruiterRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);

export default app;
