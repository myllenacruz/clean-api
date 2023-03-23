import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountParams } from "@domain/models/account/ICreateAccountParams";

export interface ICreateAccountRepository {
	create(accountData: ICreateAccountParams): Promise<IAccountModel>;
}