import {
  SellerCategory as PrismaSellerCategory,
  ProductCategory as PrismaProductCategory,
} from "@prisma/client";

export enum SellerCategory {
  Bar = "Bar",
  Brewer = "Brewer",
}

export enum ProductCategory {
  WhiteSpirit = "WhiteSpirit",
  Rum = "Rum",
  Gin = "Gin",
}

export interface ICreateContent {
  userId: string;
  place_name: string;
  operating_time: string[];
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  tel: string;
  email: string;
  category: PrismaSellerCategory;
  product_category: PrismaProductCategory;
  images: string[];
}

export interface IContent extends ICreateContent {
  id: number;
}

export interface IUpdate {
  id: number;
  userId: string;
  operating_time: string[];
  description: string;
  address: string;
  tel: string;
  email: string;
  category: undefined;
  product_category: undefined;
  images: string[];
}
