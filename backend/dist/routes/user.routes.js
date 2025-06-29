"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
//@ts-ignore
router.get("/userdetails", auth_middleware_1.requireAuth, user_controller_1.getUserDetails);
exports.default = router;
