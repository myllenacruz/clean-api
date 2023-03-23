import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountParams } from "@domain/models/account/ICreateAccountParams";

export interface ICreateAccount {
	handle(account: ICreateAccountParams): Promise<IAccountModel | undefined>;
}