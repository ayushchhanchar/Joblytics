"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/register", upload_middleware_1.upload.single("resume"), auth_controller_1.register);
//@ts-ignore
router.post("/signin", auth_controller_1.signIn);
exports.default = router;
