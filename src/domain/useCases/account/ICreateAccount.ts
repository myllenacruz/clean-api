import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";

export interface ICreateAccount {
	handle(account: ICreateAccountModel): Promise<IAccountModel>;
}