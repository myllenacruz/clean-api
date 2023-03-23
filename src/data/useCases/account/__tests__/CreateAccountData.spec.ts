import { IHasher } from "@data/protocols/cryptography/hash/IHasher";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";
import { ICreateAccountParams } from "@domain/models/account/ICreateAccountParams";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { accountModel } from "@data/useCases/account/__tests__/mocks/account";
import { accountData } from "@data/useCases/account/__tests__/mocks/accountData";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";

interface ISystemUnderTest {
	hasher: IHasher;
	systemUnderTest: CreateAccountData;
	createAccountRepository: ICreateAccountRepository;
	loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
}

function makeHasher(): IHasher {
	class Hasher implements IHasher {
		async hash(value: string): Promise<string> {
			return new Promise(resolve => resolve("hashedValue"));
		}
	}

	return new Hasher();
}

function makeCreateAccountRepository(): ICreateAccountRepository {
	class CreateAccountRepository implements ICreateAccountRepository {
		async create(accountData: ICreateAccountParams): Promise<IAccountModel> {
			return new Promise(resolve => resolve(accountModel));
		}
	}

	return new CreateAccountRepository();
}

function makeFakeAccount(): IAccountModel {
	return {
		id: "validId",
		username: "janeDoe",
		email: "janedoe@email.com",
		password: "hashedPassword"
	};
}

function makeLoadAccountByUsernameRepository(): ILoadAccountByUsernameRepository {
	class LoadAccountByUsernameRepository implements ILoadAccountByUsernameRepository {
		async loadByUsername(username: string): Promise<IAccountModel | undefined> {
			return new Promise(resolve => resolve(undefined));
		}
	}

	return new LoadAccountByUsernameRepository();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const hasher = makeHasher();
	const createAccountRepository = makeCreateAccountRepository();
	const loadAccountByUsernameRepository = makeLoadAccountByUsernameRepository();
	const systemUnderTest = new CreateAccountData(
		hasher,
		createAccountRepository,
		loadAccountByUsernameRepository
	);

	return {
		hasher,
		systemUnderTest,
		createAccountRepository,
		loadAccountByUsernameRepository
	};
}

describe("CreateAccountData", () => {
	test("Should call Hasher with correct password", async () => {
		const { systemUnderTest, hasher } = makeSystemUnderTest();

		const hasherSpy = jest.spyOn(hasher, "hash");

		const accountData = {
			username: "janedoe",
			email: "valid",
			password: "1234"
		};

		await systemUnderTest.handle(accountData);

		expect(hasherSpy).toHaveBeenCalledWith("1234");
	});

	test("Should throw if Hasher throws", async () => {
		const { systemUnderTest, hasher } = makeSystemUnderTest();

		jest.spyOn(hasher, "hash").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.handle(accountData)
		).rejects.toThrow();
	});

	test("Should call CreateAccountRepository with correct values", async () => {
		const { systemUnderTest, createAccountRepository } = makeSystemUnderTest();

		const handleSype = jest.spyOn(createAccountRepository, "create");

		await systemUnderTest.handle(accountData);

		expect(handleSype).toHaveBeenCalledWith({
			username: "janedoe",
			email: "valid@email.com",
			password: "hashedValue"
		});
	});

	test("Should return an account on success", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const account = await systemUnderTest.handle(accountData);

		expect(account).toEqual(accountModel);
	});

	test("Should return undefined if LoadAccountByUsernameRepository returns an account", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();

		jest.spyOn(loadAccountByUsernameRepository, "loadByUsername")
			.mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())));

		const account = await systemUnderTest.handle(accountData);

		expect(account).toBe(undefined);
	});

	test("Should call LoadAccountByUsernameRepository with correct username", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();
		const loadSpy = jest.spyOn(loadAccountByUsernameRepository, "loadByUsername");

		await systemUnderTest.handle(makeFakeAccount());

		expect(loadSpy).toHaveBeenCalledWith("janeDoe");
	});
});