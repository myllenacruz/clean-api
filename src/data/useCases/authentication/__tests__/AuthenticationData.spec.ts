import { AuthenticationData } from "../AuthenticationData";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";
import { ITokenGenerator } from "@data/protocols/cryptography/token/ITokenGenerator";

interface ISystemUnderTest {
	systemUnderTest: AuthenticationData;
	loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	hashComparer: IHashComparer;
	tokenGenerator: ITokenGenerator;
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

function makeTokenGenerator(): ITokenGenerator {
	class TokenGenerator implements ITokenGenerator {
		async generate(id: string): Promise<string> {
			return new Promise(resolve => resolve("validToken"));
		}
	}

	return new TokenGenerator();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const loadAccountByUsernameRepository = makeLoadAccountByUsernameRepository();
	const hashComparer = makeHashComparer();
	const tokenGenerator = makeTokenGenerator();
	const systemUnderTest = new AuthenticationData(
		loadAccountByUsernameRepository,
		hashComparer,
		tokenGenerator
	);

	return {
		systemUnderTest,
		loadAccountByUsernameRepository,
		hashComparer,
		tokenGenerator
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

	test("Should return an empty string if HashComparer returns false", async () => {
		const { systemUnderTest, hashComparer } = makeSystemUnderTest();

		jest.spyOn(hashComparer, "compare").mockReturnValueOnce(
			new Promise(resolve => {
				resolve(false);
			})
		);

		const accesToken = await systemUnderTest.auth(makeFakeAuthentication());

		expect(accesToken).toBe("");
	});

	test("Should call TokenGenerator with correct id", async () => {
		const { systemUnderTest, tokenGenerator } = makeSystemUnderTest();
		const generateSpy = jest.spyOn(tokenGenerator, "generate");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(generateSpy).toHaveBeenCalledWith("validId");
	});
});