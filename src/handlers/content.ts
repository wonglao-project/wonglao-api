import { Request, Response } from "express";
import { IRepositoryContent } from "../repositories";
import { ProductCategory, SellerCategory } from "../entities/content";
import {
  IsArray,
  IsEmail,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  validate,
} from "class-validator";
import { Expose, plainToInstance } from "class-transformer";

export function newHandlerContent(repo: IRepositoryContent) {
  return new HandlerContent(repo);
}

class CreateContentRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  @Expose({ name: "Place_name" })
  place_name!: string;
  @IsArray()
  @IsString({ each: true })
  operating_time!: string[];
  @IsString()
  description!: string;
  @IsLatitude()
  latitude!: number;
  @IsLongitude()
  longitude!: number;
  @IsString()
  address!: string;
  @IsString()
  tel!: string;
  @IsEmail()
  email!: string;
  @IsString()
  @IsIn(["Bar", "Brewer"])
  category!: string;
  @IsString()
  @IsIn(["Gin", "Rum", "WhiteSpirit"])
  product_category!: string;
  @IsString()
  @IsArray()
  imges!: string[];
}

class HandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(req: Request, res: Response): Promise<Response> {
    const body = plainToInstance(CreateContentRequest, req.body);
    const validationErrors = await validate(body);
    if (validationErrors.length > 0) {
      return res.status(400).json(validationErrors);
    }

    // const {
    //     place_name,
    //     operating_time,
    //     description,
    //     latitude,
    //     longitude,
    //     address,
    //     tel,
    //     email,
    //     category,
    //     product_category,
    //     imges
    // } = req.body
    // if(! place_name){
    //     return res.status(400).json({error : `missing place_name in body`}).end()
    // }

    try {
      const createdContent = await this.repo.createContent({
        userId: body.userId,
        place_name: body.place_name,
        operating_time: body.operating_time,
        description: body.description,
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        tel: body.tel,
        email: body.email,
        category: this.convertStringToSellerCategory(body.category),
        product_category: this.convertStringToProductCategory(
          body.product_category
        ),
        images: body.imges,
      });
      return res.status(201).json(createdContent).end();
    } catch (err) {
      const errMsg = `failed to create content`;
      return res.status(500).json({ error: errMsg }).end();
    }
  }
  private convertStringToSellerCategory(sc: string): SellerCategory {
    switch (sc) {
      case "Bar":
        return SellerCategory.Bar;

      case "Brewer":
        return SellerCategory.Brewer;

      default:
        throw new Error(`${sc} is not a valid SellerCategory`);
    }
  }
  private convertStringToProductCategory(pc: string): ProductCategory {
    switch (pc) {
      case "Gin":
        return ProductCategory.Gin;

      case "Rum":
        return ProductCategory.Rum;

      case "WhiteSpirit":
        return ProductCategory.WhiteSpirit;

      default:
        throw new Error(`${pc} is not a valid ProductCategory`);
    }
  }
}
