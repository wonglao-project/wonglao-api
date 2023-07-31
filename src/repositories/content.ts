import { PrismaClient } from "@prisma/client";
import {
  ICreateContent,
  IContent,
  IUpdateContent,
  ICreateProduct,
  IProduct,
  IContentWithSellerId,
} from "../entities/content";
import { IRepositoryContent } from ".";

export function newRepositoryContent(db: PrismaClient): IRepositoryContent {
  return new RepositoryContent(db);
}

class RepositoryContent implements IRepositoryContent {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(arg: ICreateContent): Promise<IContent> {
    console.log({
      data: {
        place_name: arg.place_name,
        operating_time: arg.operating_time,
        description: arg.description,
        latitude: arg.latitude,
        longitude: arg.longitude,
        address: arg.address,
        tel: arg.tel,
        email: arg.email,
        category: arg.category,
        images: arg.images,
      },
    });

    return await this.db.seller.create({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            password: false,
          },
        },
      },
      data: {
        userId: undefined,
        user: {
          connect: {
            id: arg.userId,
          },
        },
        place_name: arg.place_name,
        operating_time: arg.operating_time,
        description: arg.description,
        latitude: arg.latitude,
        longitude: arg.longitude,
        address: arg.address,
        tel: arg.tel,
        email: arg.email,
        category: arg.category,
        images: arg.images,
      },
    });
  }

  async createProduct(arg: ICreateProduct): Promise<IProduct> {
    console.log("arg.sellerId", arg.sellerId);
    return await this.db.product.create({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            password: false,
          },
        },
      },
      data: {
        userId: undefined,
        user: {
          connect: {
            id: arg.userId,
          },
        },

        sellerId: undefined,
        seller: {
          connect: {
            id: arg.sellerId,
          },
        },
        product_name: arg.product_name,
        product_category: arg.product_category,
        description: arg.description,
        images: arg.images,
      },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.seller.findMany();
  }

  async getProducts(): Promise<IProduct[]> {
    return await this.db.product.findMany();
  }
  async getContentById(id: number): Promise<IContent | null> {
    return await this.db.seller.findUnique({
      where: { id },
    });
  }

  async getProductById(id: number): Promise<IProduct | null> {
    return await this.db.product.findUnique({
      where: { id },
    });
  }

  async updateUserContent(arg: IUpdateContent): Promise<IContent> {
    const uSeller = await this.db.seller.findUnique({
      where: { id: arg.id },
    });

    if (!uSeller) {
      return Promise.reject(`no such content ${arg.id}`);
    }

    if (uSeller.userId !== arg.userId) {
      return Promise.reject(`bad ownerId : ${arg.userId}`);
    }

    return await this.db.seller.update({
      where: { id: arg.id },
      data: {
        operating_time: arg.operating_time,
        description: arg.description,
        address: arg.address,
        tel: arg.tel,
        email: arg.email,
        category: arg.category,
        images: arg.images,
      },
    });
  }

  async updateUserProduct(arg: IProduct): Promise<IProduct> {
    const uProduct = await this.db.product.findUnique({
      where: { id: arg.id },
    });

    if (!uProduct) {
      return Promise.reject(`no product ${arg.id}`);
    }

    if (uProduct.userId !== arg.userId) {
      return Promise.reject(`bad ownerId : ${arg.userId}`);
    }

    return await this.db.product.update({
      where: { id: arg.id },
      data: {
        product_name: arg.product_name,
        product_category: arg.product_category,
        description: arg.description,
        images: arg.images,
      },
    });
  }
}
