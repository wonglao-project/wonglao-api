export interface IGoogleApiService{
    getPlaceId(placeNameInput: String): Promise<any>
    getPlaceDetail(placeIdInput: string): Promise<any>
}