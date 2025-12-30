"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signToken(payload) {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        "7d");
    const options = {
        expiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
function verifyToken(token) {
    const secret = process.env.JWT_SECRET || "dev_secret";
    return jsonwebtoken_1.default.verify(token, secret);
}
