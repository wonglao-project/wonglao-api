import { Request, Response } from "express";
import { IRepositoryContent } from "../repositories";
import { SellerCategory } from "../entities/content";
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

  // @IsString()
  // @IsIn(["Gin", "Rum", "WhiteSpirit"])
  // product_category!: string;

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
    const body = { ...req.body, userId };

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

  // private convertStringToProductCategory(pc: string): ProductCategory {
  //   switch (pc) {
  //     case "Gin":
  //       return ProductCategory.Gin;

  //     case "Rum":
  //       return ProductCategory.Rum;

  //     case "WhiteSpirit":
  //       return ProductCategory.WhiteSpirit;

  //     default:
  //       throw new Error(`${pc} is not a valid ProductCategory`);
  //   }
  // }

  async getContents(req: Request, res: Response): Promise<Response> {
    try {
      const contents = await this.repo.getContents();
      return res.status(200).json(contents).end();
    } catch (err) {
      console.error("failed to get contents", err);
      return res.status(500).json({ error: "failed to get contents" }).end();
    }
  }

  async getContentById(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .getContentById(id)
      .then((content) => {
        if (!content) {
          return res
            .status(404)
            .json({ error: `no such content : ${id}` })
            .end();
        }
        return res.status(200).json(content).end();
      })
      .catch((err) => {
        const errMsg = `failed to get content ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }
  async deleteContent(
    req: JwtAuthRequest<WithId, WithMsg>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .deleteUserContent(id)
      .then((deleted) => res.status(200).json(deleted).end())
      .catch((err) => {
        console.error(`failed to delete content ${id} : ${err}`);
        return res
          .status(500)
          .json({ error: `failed to delete content ${id}` });
      });
  }
}
