import { Request, Response } from "express";
import { IRepositoryContent } from "../repositories";
import { SellerCategory } from "../entities/content";
import { JwtAuthRequest } from "../auth/jwt";
import { Empty, WithId, WithMsg } from ".";

export function newHandlerContent(repo: IRepositoryContent) {
  return new HandlerContent(repo);
}

class HandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(
    req: JwtAuthRequest<Empty, WithMsg>,
    res: Response
  ): Promise<Response> {
    const userId = req.payload.id;
    const body = { ...req.body, userId };

    if (!body) {
      return res.status(400).json({ error: `no body in req` });
    }

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
        images: body.imges,
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

  async updateUserContent(
    req: JwtAuthRequest<WithId, WithMsg>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: `missing id in params` }).end();
    }

    const {
      operating_time,
      description,
      address,
      tel,
      email,
      category,
      product_category,
      images,
    } = req.body;

    if (
      !operating_time ||
      !description ||
      !address ||
      !tel ||
      !email ||
      !category ||
      !product_category ||
      !images
    ) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    return this.repo
      .updateUserContent({
        id,
        userId: req.payload.id,
        operating_time,
        description,
        address,
        tel,
        email,
        category,
        product_category,
        images,
      })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update content ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }
}
