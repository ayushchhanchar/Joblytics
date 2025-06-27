"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.register = void 0;
const auth_schema_1 = require("../validators/auth.schema");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../conifg/prisma");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = auth_schema_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { name, email, password } = parsed.data;
    const existing = yield prisma_1.Client.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = yield (0, hash_1.hashPassword)(password);
    let resumeUrl = undefined;
    let resumeText = undefined;
    if (req.file) {
        resumeUrl = `/uploads/resumes/${req.file.filename}`;
        const buffer = fs_1.default.readFileSync(req.file.path);
        const parsedPdf = yield (0, pdf_parse_1.default)(buffer);
        resumeText = parsedPdf.text;
    }
    const user = yield prisma_1.Client.user.create({
        data: {
            name,
            email,
            password: hashed,
            resumeUrl,
            resumeText,
        },
    });
    res
        .status(201)
        .json({ user: { id: user.id, name: user.name, email: user.email } });
});
exports.register = register;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = auth_schema_1.signInSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res
            .status(400)
            .json({ error: parsedData.error.flatten().fieldErrors });
    }
    const { email, password } = parsedData.data;
    const user = yield prisma_1.Client.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = (0, jwt_1.signToken)(user.id);
    res
        .status(200)
        .json({ token, user: { id: user.id, name: user.name, email: user.email } });
});
exports.signIn = signIn;
