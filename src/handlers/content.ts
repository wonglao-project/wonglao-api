import { Response } from "express";
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
import { JwtAuthRequest } from "../auth/jwt";

export function newHandlerContent(repo: IRepositoryContent) {
  return new HandlerContent(repo);
}

class CreateContentRequest {
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "place_name" })
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

  @IsString({ each: true })
  @IsArray()
  imges!: string[];
}

class HandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(req: JwtAuthRequest, res: Response): Promise<Response> {
    const userId = req.payload.id;
    const body = { ...req.body, userId }

    const validateBody = plainToInstance(CreateContentRequest, body);
    const validationErrors = await validate(validateBody);
    console.log(validationErrors);
    if (validationErrors.length > 0) {
      return res.status(400).json(validationErrors);
    }

    try {
      const createdContent = await this.repo.createContent({
        userId: validateBody.userId,
        place_name: validateBody.place_name,
        operating_time: validateBody.operating_time,
        description: validateBody.description,
        latitude: validateBody.latitude,
        longitude: validateBody.longitude,
        address: validateBody.address,
        tel: validateBody.tel,
        email: validateBody.email,
        category: this.convertStringToSellerCategory(validateBody.category),
        product_category: this.convertStringToProductCategory(
          validateBody.product_category
        ),
        images: validateBody.imges,
      });

      console.log(createdContent);

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
