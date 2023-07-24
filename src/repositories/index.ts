import { ICreateContent } from "../entities/content";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<any>;
}
