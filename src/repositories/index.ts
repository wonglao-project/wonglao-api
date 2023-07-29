import {
  ICreateContent,
  IContent,
  IUpdate,
  ICreateProduct,
  IProduct,
} from "../entities/content";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<any>;
  createProduct(arg: ICreateProduct): Promise<IProduct>;
  getContents(): Promise<IContent[]>;
  getContentById(id: number): Promise<IContent | null>;
  updateUserContent(arg: IUpdate): Promise<IContent>;
}
