import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export type JwtPayload = { id: string; role: "DOCTOR" | "PATIENT" | "ADMIN" };

export function signToken(payload: JwtPayload) {
  const secret: Secret = process.env.JWT_SECRET || "dev_secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"];
  const options: SignOptions = {
    expiresIn,
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string) {
  const secret: Secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.verify(token, secret) as JwtPayload;
}
