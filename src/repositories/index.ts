import {
  ICreateContent,
  IContent,
  IUpdateContent,
  ICreateProduct,
  IProduct,
} from "../entities/content";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<any>;
  createProduct(arg: ICreateProduct): Promise<IProduct>;
  getContents(): Promise<IContent[]>;
  getContentById(id: number): Promise<IContent | null>;
  updateUserContent(arg: IUpdateContent): Promise<IContent>;
  getProducts(): Promise<IProduct[]>;
  getProductById(id: number): Promise<IProduct | null>;
  updateUserProduct(arg: IProduct): Promise<IProduct>;
}
