import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";
import { IHasher } from "@data/protocols/cryptography/hash/IHasher";
import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";

export class CreateAccountData implements ICreateAccount {
	private readonly hasher: IHasher;
	private readonly createAccountRepository: ICreateAccountRepository;

	constructor(
		hasher: IHasher,
		createAccountRepository: ICreateAccountRepository
	) {
		this.hasher = hasher;
		this.createAccountRepository = createAccountRepository;
	}

	public async handle(accountData: ICreateAccountModel): Promise<IAccountModel> {
		const hashedPass = await this.hasher.hash(accountData.password);

		const account = await this.createAccountRepository.create(
			Object.assign({}, accountData, {
				password: hashedPass
			})
		);

		return account;
	}
}