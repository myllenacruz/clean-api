import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountModel } from "@domain/useCases/account/ICreateAccountModel";

export interface ICreateAccountRepository {
	handle(accountData: ICreateAccountModel): Promise<IAccountModel>;
}