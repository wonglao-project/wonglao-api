import { Request, Response } from "express";
import "dotenv/config";
import { IGoogleApiService } from "../services";
import { IHandlerGoogleService } from ".";


export function newHandlerGoogleService(client: IGoogleApiService) {
  return new HandlerGoogleService(client);
}


class HandlerGoogleService implements IHandlerGoogleService {
  private readonly client: IGoogleApiService;

  constructor(client: IGoogleApiService) {
    this.client = client;
  }

  async getPlaceIdandPlaceDetail(
    req: Request,
    res: Response
  ): Promise<Response> {
    if (!req.query.name) {
      return res.status(400).json({ error: `missing name in params` });
    }

    const placeName = req.query.name;

    if (typeof placeName !== "string") {
      return res.status(400).json({ error: `name must be string` });
    }
    try {
      const result = await this.client.getPlaceId(placeName);
      if (!result) {
        return res
          .status(404)
          .json({ error: `no ${placeName} in google map` })
          .end();
      }
      console.log({ result: result.data.candidates });

      const placeId = result.data.candidates[0].place_id;
      const details = await this.client.getPlaceDetail(placeId);

      const detailsResult = {
        place_name: details.result.name,
        operating_time: details.result.opening_hours?.weekday_text,
        latitude: details.result.geometry?.location.lat,
        longtitude: details.result.geometry?.location.lng,
        address: details.result.formatted_address,
        tel: details.result.formatted_phone_number,
      }

      console.log(details);
      console.log(detailsResult);
      return res.status(200).json(detailsResult).end();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: `failed to get place id` }).end();
    }
  }
}
