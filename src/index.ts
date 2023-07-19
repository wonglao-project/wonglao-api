import 'reflect-metadata'
import { PrismaClient } from "@prisma/client";
import express from "express"

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";

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

    const port = process.env.PORT || 8000;
    const server = express();
    server.use(express.json())
    
    const contentRouter = express.Router()

    server.use("/content", contentRouter)

    server.get("/", (_ , res)=> {
    return res.status(200).json({status : "ok"}).end()
    })

    // Content API
    contentRouter.post("/", handlerContent.createContent.bind(handlerContent))

    server.listen(port , ()=> console.log(`server is listening on ${port}`))
}

main();