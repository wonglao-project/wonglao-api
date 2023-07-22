import { PlaceDetailsResponseData } from "@googlemaps/google-maps-services-js"

export interface IGoogleApiService{
    getPlaceId(placeNameInput: String): Promise<any>
    getPlaceDetail(placeIdInput: string): Promise<PlaceDetailsResponseData>
}