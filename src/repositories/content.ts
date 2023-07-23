import {
  PrismaClient,
  SellerCategory as PrismaSellerCategory,
  ProductCategory as PrismaProductCategory,
} from "@prisma/client";
import {
  ICreateContent,
  SellerCategory,
  ProductCategory,
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

  async createContent(arg: ICreateContent): Promise<any> {
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
        category: this.convertToPrismaCategory(arg.category),
        product_category: this.convertToPrismaProductCategory(
          arg.product_category
        ),
        imges: arg.imges,
      },
    });

    return await this.db.seller.create({
      data: {
        place_name: arg.place_name,
        operating_time: arg.operating_time,
        description: arg.description,
        latitude: arg.latitude,
        longitude: arg.longitude,
        address: arg.address,
        tel: arg.tel,
        email: arg.email,
        category: this.convertToPrismaCategory(arg.category),
        product_category: this.convertToPrismaProductCategory(
          arg.product_category
        ),
        imges: arg.imges,
      },
    });
  }

  async getContents(): Promise<any> {
    return await this.db.seller.findMany();
  }

  private convertToPrismaCategory(sc: SellerCategory): PrismaSellerCategory {
    switch (sc) {
      case SellerCategory.Bar:
        return "Bar";
      case SellerCategory.Brewer:
        return "Brewer";
    }
  }
  private convertToPrismaProductCategory(
    pc: ProductCategory
  ): PrismaProductCategory {
    switch (pc) {
      case ProductCategory.Gin:
        return "Gin";
      case ProductCategory.Rum:
        return "Rum";
      case ProductCategory.WhiteSpirit:
        return "WhiteSpirit";
    }
  }
}
