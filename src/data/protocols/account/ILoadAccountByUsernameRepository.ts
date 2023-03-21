import { IAccountModel } from "@domain/models/account/IAccountModel";

export interface ILoadAccountByUsernameRepository {
	load(username: string): Promise<IAccountModel>;
}