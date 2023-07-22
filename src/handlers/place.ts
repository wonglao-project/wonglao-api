import { Request, Response } from "express";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import 'dotenv/config'
import { IGoogleApiService } from "../services";
import { IHandlerGoogleService } from ".";
import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { Expose, classToPlain, instanceToPlain, plainToInstance } from "class-transformer";


export function newHandlerGoogleService(client: IGoogleApiService){
    return new HandlerGoogleService(client)
}

export class SearchByPlaceNameResponse {
    @Expose({ name: 'place_name' })
    @IsString()
    @IsNotEmpty()
    placeName!: string;
    
    @Expose({ name: 'operating_time' })
    @IsString({ each: true })
    operatingTime!: string[];

    @Expose({ name: 'latitude' })
    @IsLatitude()
    latitude!: number;

    @Expose({ name: 'longtitude' })
    @IsLongitude()
    longtitude!: number;

    @Expose({ name: 'address' })
    @IsString()
    address!: string;

    @Expose({ name: 'tel' })
    @IsOptional()
    @IsString()
    tel!: string;
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
        if(!req.query.name){
            return res.status(400).json({error: `missing name in params`})
        }
        
        const placeName = req.query.name

        if(typeof placeName !== 'string'){
            return res.status(400).json({error: `name must be string`})
        }
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

            const detailsResult = details.result as Required<typeof details['result']>
            const response = plainToInstance(SearchByPlaceNameResponse, { 
                place_name: detailsResult.name, 
                operating_time: detailsResult.opening_hours.weekday_text,
                latitude: detailsResult.geometry.location.lat,
                longtitude: detailsResult.geometry.location.lng,
                address: detailsResult.formatted_address,
                tel: detailsResult.formatted_phone_number,
             })
            
            console.log(details)
            console.log(response)
            return res.status(200).json( instanceToPlain(response) ).end()

        } catch(err){
            console.log(err)
            return res.status(500).json({error : `failed to get place id`}).end()
        }

    }
}


