import { IAccountModel } from "@domain/models/account/interfaces/IAccountModel";
import { ICreateAccountModel } from "@domain/useCases/account/interfaces/ICreateAccountModel";

export interface ICreateAccountRepository {
	handle(accountData: ICreateAccountModel): Promise<IAccountModel>;
}