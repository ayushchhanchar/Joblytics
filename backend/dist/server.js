"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api", auth_routes_1.default);
app.use("/api", application_routes_1.default);
app.use("/api/resume", resume_routes_1.default);
app.use("/api", user_routes_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
