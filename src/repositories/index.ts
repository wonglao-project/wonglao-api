import { ICreateContent, IContent } from "../entities/content";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<any>;
  getContents(): Promise<IContent[]>;
}
