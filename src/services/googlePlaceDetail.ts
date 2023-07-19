import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({})

client.placeDetails({
    params: {
        place_id: "ChIJmQzhQUud4jARktrLHEptl9I",
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
}).then(r => {
    console.log(r.data.result)
}).catch(err => {
    console.log(err)
})