import { Request, Response } from "express";
import { IRepositoryContent } from "../repositories";
import { SellerCategory } from "../entities/content";
import { JwtAuthRequest } from "../auth/jwt";
import { Empty, WithId, WithMsgContent, WithMsgProduct } from ".";

export function newHandlerContent(repo: IRepositoryContent) {
  return new HandlerContent(repo);
}

class HandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(
    req: JwtAuthRequest<Empty, WithMsgContent>,
    res: Response
  ): Promise<Response> {
    const userId = req.payload.id;
    const body = { ...req.body };

    if (!body) {
      return res.status(400).json({ error: `no body in req` });
    }

    console.log("body", body)

    try {
      const createdContent = await this.repo.createContent({
        userId: userId,
        place_name: body.place_name,
        operating_time: body.operating_time,
        description: body.description,
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        tel: body.tel,
        email: body.email,
        category: this.convertStringToSellerCategory(body.category),
        images: body.images,
      });

      console.log("createdContent", createdContent);

      return res.status(201).json(createdContent).end();
    } catch (err) {
      const errMsg = `failed to create content`;
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async createProduct(
    req: JwtAuthRequest<Empty, WithMsgProduct>,
    res: Response
  ): Promise<Response> {
    const userId = req.payload.id;
    const body = { ...req.body, userId };

    if (!body) {
      return res.status(400).json({ error: `no body in req` });
    }

    try {
      const createdProduct = await this.repo.createProduct({
        userId: body.userId,
        sellerId: body.sellerId,
        product_name: body.product_name,
        product_category: body.product_category,
        description: body.description,
        images: body.images,
      });

      return res.status(201).json(createdProduct).end();
    } catch (err) {
      console.log(err);
      const errMsg = `failed to create product`;
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

  async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.repo.getProducts();
      return res.status(200).json(products).end();
    } catch (err) {
      return res.status(500).json({ error: "failed to get products" }).end();
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

  async getProductbyId(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .getProductById(id)
      .then((product) => {
        if (!product) {
          return res
            .status(404)
            .json({ error: `no product : ${id}` })
            .end();
        }

        return res.status(200).json(product).end();
      })
      .catch((err) => {
        const errMsg = `failed to get product ${id}: ${err}`;
        return res.status(500).json({ error: errMsg });
      });
  }

  async updateUserContent(
    req: JwtAuthRequest<WithId, WithMsgContent>,
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
        images,
      })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update content ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async updateUserProduct(
    req: JwtAuthRequest<WithId, WithMsgProduct>,
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

    const { sellerId, product_name, product_category, description, images } =
      req.body;

    if (
      !sellerId ||
      !product_name ||
      !product_category ||
      !description ||
      !images
    ) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    return this.repo
      .updateUserProduct({
        id,
        sellerId,
        userId: req.payload.id,
        product_name,
        product_category,
        description,
        images,
      })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update product ${id}: ${err}`;
        return res.status(500).json({ error: errMsg }).end();
      });
  }
}
