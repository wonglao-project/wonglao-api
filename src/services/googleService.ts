import { Client, PlaceDetailsResponseData, PlaceInputType } from "@googlemaps/google-maps-services-js";
import { IGoogleApiService } from ".";
import 'dotenv/config'

export function newGoogleApiService(client: Client): IGoogleApiService{
    return new GoogleApiService(client)
}


class GoogleApiService implements IGoogleApiService {
    private client: Client

    constructor(client: Client){
        this.client = client
    }

    async getPlaceId(placeNameInput: String): Promise<any>{
        return this.client.findPlaceFromText({
            params: {
                input: placeNameInput + "Thailand",
                inputtype: PlaceInputType.textQuery ,
                client_id: "",
                client_secret: "",
                key: process.env.API_KEY,
                fields: [
                        "formatted_address", 
                        "geometry/location", 
                        "place_id", 
                        "opening_hours" 
                        ]
                    }
            })
        }

    async getPlaceDetail(placeIdInput: string): Promise<PlaceDetailsResponseData>{
        const result = await this.client.placeDetails({
            params: {
                place_id: placeIdInput,
                client_id: "",
                client_secret: "",
                key: process.env.API_KEY,
                fields: [
                        "name",
                        "formatted_address",
                        "formatted_phone_number",
                        "geometry",
                        "opening_hours/open_now",
                        "opening_hours/periods",
                        "opening_hours/weekday_text"
                         ]
            }
        })
        return result.data
    }  

}
