import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface IHanderContent {
  createContent(req: Request, res: Response): Promise<Response>;
}

export interface IHandlerGoogleService {
  getPlaceIdandPlaceDetail(
    req: Request,
    res: Response
  ): Promise<Response | void>;
}

export interface Empty {}

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export type HandlerFunc<Request> = (
  req: Request,
  res: Response
) => Promise<Response>;

export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface With_User {
  username: string;
  password: string;
}

export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser>>;
  login: HandlerFunc<AppRequest<Empty, WithUser>>;
  logout: HandlerFunc<JwtAuthRequest<Empty, Empty>>;
}
