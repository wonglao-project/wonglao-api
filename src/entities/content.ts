export enum SellerCategory {
  Bar,
  Brewer,
}

export enum ProductCategory {
  WhiteSpirit,
  Rum,
  Gin,
}

export interface ICreateContent {
  place_name: string;
  operating_time: string[];
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  tel: string;
  email: string;
  category: SellerCategory;
  product_category: ProductCategory;
  images: string[];
}
