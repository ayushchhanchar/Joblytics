"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_routes_1 = __importDefault(require("./auth.routes"));
//@ts-ignore
auth_routes_1.default.post("/add-applications", auth_middleware_1.requireAuth, application_controller_1.addApplication);
//@ts-ignore
auth_routes_1.default.get("/get-applications", auth_middleware_1.requireAuth, application_controller_1.getApplication);
//@ts-ignore
auth_routes_1.default.patch("/applications/:id", auth_middleware_1.requireAuth, application_controller_1.updateApplicationStatus);
//@ts-ignore
auth_routes_1.default.delete("/applications/:id", auth_middleware_1.requireAuth, application_controller_1.deleteApplication);
exports.default = auth_routes_1.default;
