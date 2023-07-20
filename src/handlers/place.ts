import { Request, Response } from "express";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import 'dotenv/config'
import { IGoogleApiService } from "../services";
import { IHandlerGoogleService } from ".";

// export function newHandlerPlace(){
//     return new HandlerPlace
// }

// class HandlerPlace {

//     async getPlaceId(
//         req: Request,
//         res: Response
//     ): Promise<Response | void>{
//         const { placeName } = req.body
//         if (!placeName){
//             return res.status(400).json({ error: `missing placeName in body`})
//         }

//         const client = new Client({})
//         return client.findPlaceFromText({
//             params: {
//                 input : placeName  + "Thailand",
//                 inputtype: PlaceInputType.textQuery ,
//         client_id: "",
//         client_secret: "",
//         key: process.env.API_KEY,
//         fields: ["formatted_address", "geometry/location", "place_id", "opening_hours" ]
//             }
//         })
//         .then( r => {
//             console.log(r.data.candidates)
//             res.status(200).json( r.data.candidates).end()
//         })
//         .catch( err => {
//             console.error(err)
//             return res.status(500).json({error : `failed to get placeId`}).end()
//         })
//     //     try {
//     //         const client = new Client({})
//     //         client.findPlaceFromText({
//     //             params: {
//     //                 input: placeName,
//     //                 inputtype: PlaceInputType.textQuery ,
//     //     client_id: "",
//     //     client_secret: "",
//     //     key: `##########`,
//     //     fields: ["formatted_address", "geometry/location", "place_id", "opening_hours" ]
//     //             }
//     //         }).then( r => {
//     //             placeId = r.data.candidates[0].place_id
//     //             console.log(r.data.candidates[0].place_id)
//     //             console.log(r.data.candidates)
//     //             result = r.data.candidates
//     //         }).catch(err => {
//     //             console.log(err)
//     //         })
//     //         return res.status(200).json({result}).end()
//     //     }catch(err){
//     //         const errMsg = "failed to get place id";
//     //   console.error(`${errMsg} ${err}`);

//     //   return res.status(500).json({ error: errMsg }).end();
//     // }
// }

//     async getPlaceDetail(
//         req: Request,
//         res: Response
//     ):Promise<Response | void>{
//         const { placeId } = req.body
//         if(!placeId){
//             return res.status(400).json({ error: `missing placeId in body`})
//         }
//         const client = new Client({})
//        return  client.placeDetails({
//             params: {
//                 place_id : placeId,
//                 client_id: "",
//         client_secret: "",
//         key: process.env.API_KEY,
//         fields: [
//             "formatted_address",
//             "formatted_phone_number",
//             "name,geometry",
//             "opening_hours/open_now",
//             "opening_hours/periods",
//             "opening_hours/weekday_text"
//         ]
//             }
//         })
//         .then( r => {
//             console.log(r.data.result)
//             res.status(200).json(r.data.result).end()
//         })
//         .catch( err => {
//             console.error(err)
//             return res.status(500).json({error : `failed to get place detail`}).end()
//         })
//     }
// }

export function newHandlerGoogleService(client: IGoogleApiService){
    return new HandlerGoogleService(client)
}

class HandlerGoogleService implements IHandlerGoogleService {
    private readonly client: IGoogleApiService

    constructor(client: IGoogleApiService){
        this.client = client
    }

    async getPlaceIdandPlaceDetail(
        req: Request,
        res: Response
    ): Promise<Response>{
        if(!req.params.name){
            return res.status(400).json({error: `missing name in params`})
        }
        
        const placeName = req.params.name

        try {
            const result = await this.client.getPlaceId(placeName)
            if(!result){
                return res
                .status(404)
                .json({error : `no ${placeName} in google map`})
                .end()
            }
            console.log({result:result.data.candidates})

            const placeId = result.data.candidates[0].place_id
            const details = await this.client.getPlaceDetail(placeId)

            console.log(details.data.result)
            return res.status(200).json({ details: details.data.result }).end()

        } catch(err){
            console.log(err)
            return res.status(500).json({error : `failed to get place id`}).end()
        }

    }
}