import { IAccountModel } from "@domain/models/account/IAccountModel";

export interface ILoadAccountByUsernameRepository {
	loadByUsername(username: string): Promise<IAccountModel | undefined>;
}