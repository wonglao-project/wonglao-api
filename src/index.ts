import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import express from "express"

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import { newHandlerGoogleService } from './handlers/place';
import { Client } from '@googlemaps/google-maps-services-js';
import { newGoogleApiService } from './services/googleService';

async function main(){
    const db = new PrismaClient()
    const client = new Client()

    try{
        db.$connect()
    } catch (err){
        console.error(err)
        return
    }

    const repoContent = newRepositoryContent(db)
    const handlerContent = newHandlerContent(repoContent)
    // const handlerPlace = newHandlerPlace()
    const googleApiService = newGoogleApiService(client)
    const handlerGoogleService = newHandlerGoogleService(googleApiService)

    const port = process.env.PORT || 8000;
    const server = express();
    server.use(express.json())
    
    const contentRouter = express.Router()
    // const placeRouter = express.Router()
    const serviceRouter = express.Router()

    server.use("/content", contentRouter)
    // server.use("/place", placeRouter)
    server.use("/service", serviceRouter)

    server.get("/", (_ , res)=> {
    return res.status(200).json({status : "ok"}).end()
    })

    // Content API
    contentRouter.post("/", handlerContent.createContent.bind(handlerContent))

    // Place API
    // placeRouter.get("/", handlerPlace.getPlaceId.bind(handlerPlace))
    // placeRouter.get("/detail", handlerPlace.getPlaceDetail.bind(handlerPlace))

    //Google Service API
    serviceRouter.get("/:name",handlerGoogleService.getPlaceIdandPlaceDetail.bind(handlerGoogleService) )

    server.listen(port , ()=> console.log(`server is listening on ${port}`))

}

main();