import { ICreateContent, IContent, IUpdate } from "../entities/content";

export interface IRepositoryContent {
  createContent(arg: ICreateContent): Promise<any>;
  getContents(): Promise<IContent[]>;
  getContentById(id: number): Promise<IContent | null>;
  updateUserContent(arg: IUpdate): Promise<IContent>;
}
