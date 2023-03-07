import bcrypt from "bcrypt";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";

jest.mock("bcrypt", () => ({
	async hash(): Promise<string> {
		return new Promise(resolve => resolve("hashedValue"));
	}
}));

const salt = 12;
function makeSystemUnderTest(): BCryptAdapter {
	return new BCryptAdapter(salt);
}

describe("BCryptAdapter", () => {
	test("Should call bcrypt with correct values", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const hash = jest.spyOn(bcrypt, "hash");

		await systemUnderTest.encrypt("value");

		expect(hash).toHaveBeenCalledWith("value", salt);
	});

	test("Should throw if bcrypt throws", async () => {
		const systemUnderTest = makeSystemUnderTest();

		jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
			throw new Error();
		});

		const promise = systemUnderTest.encrypt("value");

		await expect(promise).rejects.toThrow();
	});
});