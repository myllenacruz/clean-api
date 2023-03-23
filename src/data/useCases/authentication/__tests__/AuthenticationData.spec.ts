import { AuthenticationData } from "../AuthenticationData";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IAuthenticationParams } from "@domain/models/authentication/IAuthenticationParams";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";
import { IEncrypter } from "@data/protocols/cryptography/token/IEncrypter";
import { IUpdateAccessTokenRepository } from "@data/protocols/cryptography/token/IUpdateAccessTokenRepository";

interface ISystemUnderTest {
	systemUnderTest: AuthenticationData;
	loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	hashComparer: IHashComparer;
	encrypter: IEncrypter;
	updateAccessTokenRepository: IUpdateAccessTokenRepository;
}

function makeFakeAccount(): IAccountModel {
	return {
		id: "validId",
		username: "janeDoe",
		email: "janedoe@email.com",
		password: "hashedPassword"
	};
}

function makeFakeAuthentication(): IAuthenticationParams {
	return {
		username: "janeDoe",
		password: "1234"
	};
}

function makeLoadAccountByUsernameRepository(): ILoadAccountByUsernameRepository {
	class LoadAccountByUsernameRepository implements ILoadAccountByUsernameRepository {
		async loadByUsername(username: string): Promise<IAccountModel> {
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

function makeEncrypterGenerator(): IEncrypter {
	class Encrypter implements IEncrypter {
		async encrypt(id: string): Promise<string> {
			return new Promise(resolve => resolve("validToken"));
		}
	}

	return new Encrypter();
}

function makeUpdateAccessTokenRepository(): IUpdateAccessTokenRepository {
	class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
		async updateAccessToken(id: string, token: string): Promise<void> {
			return new Promise(resolve => resolve());
		}
	}

	return new UpdateAccessTokenRepository();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const loadAccountByUsernameRepository = makeLoadAccountByUsernameRepository();
	const hashComparer = makeHashComparer();
	const encrypter = makeEncrypterGenerator();
	const updateAccessTokenRepository = makeUpdateAccessTokenRepository();
	const systemUnderTest = new AuthenticationData(
		loadAccountByUsernameRepository,
		hashComparer,
		encrypter,
		updateAccessTokenRepository
	);

	return {
		systemUnderTest,
		loadAccountByUsernameRepository,
		hashComparer,
		encrypter,
		updateAccessTokenRepository
	};
}

describe("AuthenticationDatabase", () => {
	test("Should call LoadAccountByUsernameRepository with correct username", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();
		const loadSpy = jest.spyOn(loadAccountByUsernameRepository, "loadByUsername");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(loadSpy).toHaveBeenCalledWith("janeDoe");
	});

	test("Should throw if LoadAccountByUsernameRepository throws", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();

		jest.spyOn(loadAccountByUsernameRepository, "loadByUsername").mockImplementationOnce(() => {
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

	test("Should call Encrypter with correct id", async () => {
		const { systemUnderTest, encrypter } = makeSystemUnderTest();
		const generateSpy = jest.spyOn(encrypter, "encrypt");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(generateSpy).toHaveBeenCalledWith("validId");
	});

	test("Should throw if Encrypter throws", async () => {
		const { systemUnderTest, encrypter } = makeSystemUnderTest();

		jest.spyOn(encrypter, "encrypt").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.auth(makeFakeAuthentication())
		).rejects.toThrow();
	});

	test("Should return an token on success", async () => {
		const { systemUnderTest } = makeSystemUnderTest();
		const accessToken = await systemUnderTest.auth(makeFakeAuthentication());

		expect(accessToken).toBe("validToken");
	});

	test("Should call UpdateAccessTokenRepository with correct values", async () => {
		const { systemUnderTest, updateAccessTokenRepository } = makeSystemUnderTest();
		const updateSpy = jest.spyOn(updateAccessTokenRepository, "updateAccessToken");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(updateSpy).toHaveBeenCalledWith("validId", "validToken");
	});
});