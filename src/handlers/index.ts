import { Request, Response } from "express"

export interface IHanderContent {
    createContent(
        req: Request,
        res: Response
    ): Promise<Response>
}

export interface IHandlerGoogleService{
    getPlaceIdandPlaceDetail(
        req: Request,
        res: Response
    ): Promise<Response | void>
}