import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface IHanderContent {
  createContent(req: Request, res: Response): Promise<Response>;
  getContents(req: Request, res: Response): Promise<Response>;
  getContentById(req: Request, res: Response): Promise<Response>;
  updateUserContent(
    req: JwtAuthRequest<WithId, WithMsgContent>,
    res: Response
  ): Promise<Response>;
  createProduct(
    req: JwtAuthRequest<Empty, WithMsgProduct>,
    res: Response
  ): Promise<Response>;
  ç;
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

export interface WithId {
  id: string;
}

export interface WithMsgContent {
  place_name: string;
  operating_time: string[];
  description: string;
  latitude: string;
  longitude: string;
  address: string;
  tel: string;
  email: string;
  category: string;
  images: string[];
}

export interface WithMsgProduct {
  product_name: string;
  product_category: string;
  description: string;
  images: string[];
}
