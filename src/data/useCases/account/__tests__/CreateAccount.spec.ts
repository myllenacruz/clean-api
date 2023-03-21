import { IEncrypter } from "@data/protocols/encrypter/IEncrypter";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { accountModel } from "@data/useCases/account/__tests__/mocks/account";
import { accountData } from "@data/useCases/account/__tests__/mocks/accountData";

interface ISystemUnderTest {
	encrypter: IEncrypter;
	systemUnderTest: CreateAccountData;
	createAccountRepository: ICreateAccountRepository;
}

function makeEncrypter(): IEncrypter {
	class Encrypter implements IEncrypter {
		async encrypt(value: string): Promise<string> {
			return new Promise(resolve => resolve("hashedValue"));
		}
	}

	return new Encrypter();
}

function makeCreateAccountRepository(): ICreateAccountRepository {
	class CreateAccountRepository implements ICreateAccountRepository {
		async handle(accountData: ICreateAccountModel): Promise<IAccountModel> {
			return new Promise(resolve => resolve(accountModel));
		}
	}

	return new CreateAccountRepository();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const encrypter = makeEncrypter();
	const createAccountRepository = makeCreateAccountRepository();
	const systemUnderTest = new CreateAccountData(encrypter, createAccountRepository);

	return {
		encrypter,
		systemUnderTest,
		createAccountRepository
	};
}

describe("CreateAccountData", () => {
	test("Should call Encrypter with correct password", async () => {
		const { systemUnderTest, encrypter } = makeSystemUnderTest();

		const encryptSpy = jest.spyOn(encrypter, "encrypt");

		const accountData = {
			username: "janedoe",
			email: "valid",
			password: "1234"
		};

		await systemUnderTest.handle(accountData);

		expect(encryptSpy).toHaveBeenCalledWith("1234");
	});

	test("Should throw if Encrypter throws", async () => {
		const { systemUnderTest, encrypter } = makeSystemUnderTest();

		jest.spyOn(encrypter, "encrypt").mockReturnValueOnce(
			new Promise((resolve, reject) => {
			    reject(new Error());
			})
		);

		const promise = systemUnderTest.handle(accountData);

		await expect(promise).rejects.toThrow();
	});

	test("Should call CreateAccountRepository with correct values", async () => {
		const { systemUnderTest, createAccountRepository } = makeSystemUnderTest();

		const handleSype = jest.spyOn(createAccountRepository, "handle");

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
});