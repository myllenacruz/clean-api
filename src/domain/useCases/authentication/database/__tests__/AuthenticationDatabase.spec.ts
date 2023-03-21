import { AuthenticationDatabase } from "../AuthenticationDatabase";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IAuthenticationModel } from "@domain/useCases/authentication/IAuthenticationModel";

interface ISystemUnderTest {
	systemUnderTest: AuthenticationDatabase;
	loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
}

function makeFakeAccount(): IAccountModel {
	return {
		id: "validId",
		username: "janeDoe",
		email: "janedoe@email.com",
		password: "1234"
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

function makeSystemUnderTest(): ISystemUnderTest {
	const loadAccountByUsernameRepository = makeLoadAccountByUsernameRepository();
	const systemUnderTest = new AuthenticationDatabase(loadAccountByUsernameRepository);

	return {
		systemUnderTest,
		loadAccountByUsernameRepository
	};
}

describe("AuthenticationDatabase", () => {
	test("Should call LoadAccountByUsernameRepository with correct username", async () => {
		const { systemUnderTest, loadAccountByUsernameRepository } = makeSystemUnderTest();
		const loadSyp = jest.spyOn(loadAccountByUsernameRepository, "load");

		await systemUnderTest.auth(makeFakeAuthentication());

		expect(loadSyp).toHaveBeenCalledWith("janeDoe");
	});
});