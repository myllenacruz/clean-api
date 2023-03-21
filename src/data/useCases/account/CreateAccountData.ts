import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";
import { IEncrypter } from "@data/protocols/encrypter/IEncrypter";
import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";

export class CreateAccountData implements ICreateAccount {
	private readonly encrypter: IEncrypter;
	private readonly createAccountRepository: ICreateAccountRepository;

	constructor(
		encrypter: IEncrypter,
		createAccountRepository: ICreateAccountRepository
	) {
		this.encrypter = encrypter;
		this.createAccountRepository = createAccountRepository;
	}

	public async handle(accountData: ICreateAccountModel): Promise<IAccountModel> {
		const hashedPass = await this.encrypter.encrypt(accountData.password);

		const account = await this.createAccountRepository.handle(
			Object.assign({}, accountData, {
				password: hashedPass
			})
		);

		return account;
	}
}