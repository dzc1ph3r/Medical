import jwt from "jsonwebtoken";

export type JwtPayload = { id: string; role: "DOCTOR" | "PATIENT" };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}
