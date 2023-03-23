import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";
import { IHasher } from "@data/protocols/cryptography/hash/IHasher";
import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";

export class CreateAccountData implements ICreateAccount {
	private readonly hasher: IHasher;
	private readonly createAccountRepository: ICreateAccountRepository;
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;

	constructor(
		hasher: IHasher,
		createAccountRepository: ICreateAccountRepository,
		loadAccountByUsernameRepository: ILoadAccountByUsernameRepository
	) {
		this.hasher = hasher;
		this.createAccountRepository = createAccountRepository;
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
	}

	public async handle(accountData: ICreateAccountModel): Promise<IAccountModel | undefined> {
		const account = await this.loadAccountByUsernameRepository.loadByUsername(accountData.username);

		if (!account) {
			const hashedPass = await this.hasher.hash(accountData.password);
			const newAccount = await this.createAccountRepository.create(
				Object.assign({}, accountData, {
					password: hashedPass
				})
			);

			return newAccount;
		}
	}
}