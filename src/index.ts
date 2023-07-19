import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import express from "express"

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import { newHandlerPlace } from './handlers/place';

async function main(){
    const db = new PrismaClient

    try{
        db.$connect()
    } catch (err){
        console.error(err)
        return
    }

    const repoContent = newRepositoryContent(db)
    const handlerContent = newHandlerContent(repoContent)
    const handlerPlace = newHandlerPlace()

    const port = process.env.PORT || 8000;
    const server = express();
    server.use(express.json())
    
    const contentRouter = express.Router()
    const placeRouter = express.Router()

    server.use("/content", contentRouter)
    server.use("/place", placeRouter)

    server.get("/", (_ , res)=> {
    return res.status(200).json({status : "ok"}).end()
    })

    // Content API
    contentRouter.post("/", handlerContent.createContent.bind(handlerContent))

    // Place API
    placeRouter.get("/", handlerPlace.getPlaceId.bind(handlerPlace))
    placeRouter.get("/detail", handlerPlace.getPlaceDetail.bind(handlerPlace))

    server.listen(port , ()=> console.log(`server is listening on ${port}`))

}

main();