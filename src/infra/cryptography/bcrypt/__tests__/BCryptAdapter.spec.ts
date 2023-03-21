import bcrypt from "bcrypt";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";

jest.mock("bcrypt", () => ({
	async hash(): Promise<string> {
		return new Promise(resolve => resolve("hashedValue"));
	},

	async compare(): Promise<boolean> {
		return new Promise(resolve => resolve(true));
	}
}));

const salt = 12;
function makeSystemUnderTest(): BCryptAdapter {
	return new BCryptAdapter(salt);
}

describe("BCryptAdapter", () => {
	test("Should call hash with correct values", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const hash = jest.spyOn(bcrypt, "hash");

		await systemUnderTest.hash("value");

		expect(hash).toHaveBeenCalledWith("value", salt);
	});

	test("Should throw if hash throws", async () => {
		const systemUnderTest = makeSystemUnderTest();

		jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.hash("value")
		).rejects.toThrow();
	});

	test("Should return a valid hash on hash success", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const hash = await systemUnderTest.hash("value");

		expect(hash).toBe("hashedValue");
	});

	test("Should call compare with correct values", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const hash = jest.spyOn(bcrypt, "compare");

		await systemUnderTest.compare("value", "hash");

		expect(hash).toHaveBeenCalledWith("value", "hash");
	});

	test("Should return true when compare succeeds", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const isValid = await systemUnderTest.compare("value", "hash");

		expect(isValid).toBe(true);
	});

	test("Should return false when compare fails", async () => {
		const systemUnderTest = makeSystemUnderTest();

		jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false);

		const isValid = await systemUnderTest.compare("value", "hash");

		expect(isValid).toBe(false);
	});

	test("Should throw if compare throws", async () => {
		const systemUnderTest = makeSystemUnderTest();

		jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
			throw new Error();
		});

		await expect(
			systemUnderTest.compare("value", "hash")
		).rejects.toThrow();
	});
});