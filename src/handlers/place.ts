import { Request, Response } from "express";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import 'dotenv/config'

export function newHandlerPlace(){
    return new HandlerPlace
}

class HandlerPlace {

    async getPlaceId(
        req: Request,
        res: Response
    ): Promise<Response | void>{
        const { placeName } = req.body
        if (!placeName){
            return res.status(400).json({ error: `missing placeName in body`})
        }

        const client = new Client({})
        return client.findPlaceFromText({
            params: {
                input : placeName  + "Thailand",
                inputtype: PlaceInputType.textQuery ,
        client_id: "",
        client_secret: "",
        key: process.env.API_KEY,
        fields: ["formatted_address", "geometry/location", "place_id", "opening_hours" ]
            }
        })
        .then( r => {
            console.log(r.data.candidates)
            res.status(200).json( r.data.candidates).end()
        })
        .catch( err => {
            console.error(err)
            return res.status(500).json({error : `failed to get placeId`}).end()
        })
    //     try {
    //         const client = new Client({})
    //         client.findPlaceFromText({
    //             params: {
    //                 input: placeName,
    //                 inputtype: PlaceInputType.textQuery ,
    //     client_id: "",
    //     client_secret: "",
    //     key: `AIzaSyAeIt7ZhwPmF2vKdQ6TDE5h4_MKqB2eQJg`,
    //     fields: ["formatted_address", "geometry/location", "place_id", "opening_hours" ]
    //             }
    //         }).then( r => {
    //             placeId = r.data.candidates[0].place_id
    //             console.log(r.data.candidates[0].place_id)
    //             console.log(r.data.candidates)
    //             result = r.data.candidates
    //         }).catch(err => {
    //             console.log(err)
    //         })
    //         return res.status(200).json({result}).end()
    //     }catch(err){
    //         const errMsg = "failed to get place id";
    //   console.error(`${errMsg} ${err}`);

    //   return res.status(500).json({ error: errMsg }).end();
    // }
}

    async getPlaceDetail(
        req: Request,
        res: Response
    ):Promise<Response | void>{
        const { placeId } = req.body
        if(!placeId){
            return res.status(400).json({ error: `missing placeId in body`})
        }
        const client = new Client({})
       return  client.placeDetails({
            params: {
                place_id : placeId,
                client_id: "",
        client_secret: "",
        key: process.env.API_KEY,
        fields: [
            "formatted_address",
            "formatted_phone_number",
            "name,geometry",
            "opening_hours/open_now",
            "opening_hours/periods",
            "opening_hours/weekday_text"
        ]
            }
        })
        .then( r => {
            console.log(r.data.result)
            res.status(200).json(r.data.result).end()
        })
        .catch( err => {
            console.error(err)
            return res.status(500).json({error : `failed to get place detail`}).end()
        })
    }
}