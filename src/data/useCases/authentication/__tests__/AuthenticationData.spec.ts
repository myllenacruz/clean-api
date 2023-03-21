import { AuthenticationData } from "../AuthenticationData";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";

interface ISystemUnderTest {
	systemUnderTest: AuthenticationData;
	loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	hashComparer: IHashComparer;
}

function makeFakeAccount(): IAccountModel {
	return {
		id: "validId",
		username: "janeDoe",
		email: "janedoe@email.com",
		password: "hashedPassword"
	};
}

function makeFakeAuthentication(): IAuthenticationModel {
	return {
		username: "janeDoe",
		password: "1234"
	};
}

function makeLoadAccountByUsernameRepository(): ILoadAccountByUsernameRepository {
	class LoadAccountByUsernameRepository implements ILoadAccountByUsernameRepository {
		async load(username: string): Promise<IAccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()));
		}
	}

	return new LoadAccountByUsernameRepository();
}

function makeHashComparer(): IHashComparer {
	class HashComparer implements IHashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return new Promise(resolve => resolve(true));
		}
	}

	return new HashComparer();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const loadAccountByUsernameRepository = makeLoadAccountByUsernameRepository();
	const hashComparer = makeHashComparer();
	const systemUnderTest = new AuthenticationData(loadAccountByUsernameRepository, hashComparer);

	return {
		systemUnderTest,
		loadAccountByUsernameRepository,
		hashComparer
	};
}

describe("AuthenticationDatabase", () => {
	test("Should call LoadAccountByUsernameRepository with correct username", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();
		const loadSpy = jest.spyOn(loadAccountByUsernameRepository, "load");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(loadSpy).toHaveBeenCalledWith("janeDoe");
	});

	test("Should throw if LoadAccountByUsernameRepository throws", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();

		jest.spyOn(loadAccountByUsernameRepository, "load").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.auth(makeFakeAuthentication())
		).rejects.toThrow();
	});

	test("Should call HashComparer with correct values", async () => {
		const { systemUnderTest, hashComparer } = makeSystemUnderTest();
		const compareSpy = jest.spyOn(hashComparer, "compare");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(compareSpy).toHaveBeenCalledWith("1234", "hashedPassword");
	});

	test("Should throw if HashComparer throws", async () => {
		const { systemUnderTest, hashComparer } = makeSystemUnderTest();

		jest.spyOn(hashComparer, "compare").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.auth(makeFakeAuthentication())
		).rejects.toThrow();
	});
});