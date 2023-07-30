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
  images: string[];
}

export interface IContent extends ICreateContent {
  id: number;
}

export interface IUpdateContent {
  id: number;
  userId: string;
  operating_time: string[];
  description: string;
  address: string;
  tel: string;
  email: string;
  category: undefined;
  images: string[];
}

export interface ICreateProduct {
  sellerId: number;
  userId: string;
  product_name: string;
  product_category: PrismaProductCategory;
  description: string;
  images: string[];
}
export interface IProduct extends ICreateProduct {
  id: number;
}
