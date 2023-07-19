import { Request, Response } from "express"

export interface IHanderContent {
    createContent(
        req: Request,
        res: Response
    ): Promise<Response>
}