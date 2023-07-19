import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import 'dotenv/config' 

const client = new Client({})

console.log(process.env.API_KEY)

client.findPlaceFromText({
    params: {
        input: "Cleverse Thailand" ,
        inputtype: PlaceInputType.textQuery ,
        client_id: "",
        client_secret: "",
        // app can not find API_KEY
        key: process.env.API_KEY,
        fields: ["formatted_address", "geometry/location", "place_id", "opening_hours" ]
    },
}).then(r => {
    console.log(r.data.candidates)
}).catch(err => {
    console.log(err)
})

