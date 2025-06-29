import express from "express";
import authRoutes from "./routes/auth.routes";
import applicationRoutes from "./routes/application.routes";
import resumeRoutes from "./routes/resume.routes";
import cors from "cors";
require ("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", authRoutes);
app.use("/api", applicationRoutes);
app.use("/api/resume", resumeRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});