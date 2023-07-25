import { PrismaClient } from "@prisma/client";
import { ICreateContent, IContent } from "../entities/content";
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
        product_category: arg.product_category,
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
        product_category: arg.product_category,
        images: arg.images,
      },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.seller.findMany();
  }

  // private convertToPrismaCategory(sc: SellerCategory): PrismaSellerCategory {
  //   switch (sc) {
  //     case SellerCategory.Bar:
  //       return "Bar";
  //     case SellerCategory.Brewer:
  //       return "Brewer";
  //   }
  // }
  // private convertToPrismaProductCategory(
  //   pc: ProductCategory
  // ): PrismaProductCategory {
  //   switch (pc) {
  //     case ProductCategory.Gin:
  //       return "Gin";
  //     case ProductCategory.Rum:
  //       return "Rum";
  //     case ProductCategory.WhiteSpirit:
  //       return "WhiteSpirit";
  //   }
  // }
}
