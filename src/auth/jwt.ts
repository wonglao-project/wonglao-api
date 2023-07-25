import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IRepositoryBlacklist } from "../repositories/blacklist";
import { Empty } from "../handlers";

const secret = process.env.JWT_SECRET || "wonglao-api-secrets";

export interface Payload {
  id: string;
  username: string;
}

export function newJwt(payload: Payload): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS512",
    expiresIn: "12h",
    issuer: "wonglao-api",
    subject: "user-login",
    audience: "user",
  });
}

export function newHandlerMiddleware(repoBlacklist: IRepositoryBlacklist) {
  return new HandlerMiddleware(repoBlacklist);
}

export interface JwtAuthRequest<Params, Body> extends Request {
  token: string;
  payload: Payload;
}

export class HandlerMiddleware {
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repoBlacklist: IRepositoryBlacklist) {
    this.repoBlacklist = repoBlacklist;
  }

  async jwtMiddleware(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    try {
      if (!token) {
        return res
          .status(401)
          .json({ error: "missing JWT token in header" })
          .end();
      }

      const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({ status: `logged out` }).end();
      }

      const decoded = jwt.verify(token, secret);
      const id = decoded["id"];
      const username = decoded["username"];

      if (!id) {
        return res.status(401).json({ error: "missing payload `id`" }).end();
      }

      if (!username) {
        return res
          .status(401)
          .json({ error: "missing payload `username`" })
          .end();
      }

      req.token = token;
      req.payload = {
        id,
        username,
      };

      return next();
    } catch (err) {
      console.error(`Auth failed for token ${token} : ${err}`);
      return res.status(401).json({ error: "authentication failed" }).end();
    }
  }
}
