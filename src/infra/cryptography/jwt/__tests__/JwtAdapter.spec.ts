import jwt from "jsonwebtoken";
import { JwtAdapter } from "@infra/cryptography/jwt/JwtAdapter";

jest.mock("jsonwebtoken", () => ({
	async sign(): Promise<string> {
		return "validToken";
	}
}));

function makeSystemUnderTest(): JwtAdapter {
	return new JwtAdapter("secret");
}

describe("JwtAdapter", () => {
	test("Should call sign with correct values", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const signSpy = jest.spyOn(jwt, "sign");

		await systemUnderTest.encrypt("validId");

		expect(signSpy).toHaveBeenCalledWith({ id: "validId" }, "secret");
	});

	test("Should return a token on sign success", async () => {
		const systemUnderTest = makeSystemUnderTest();
		const accessToken = await systemUnderTest.encrypt("validId");

		expect(accessToken).toBe("validToken");
	});

	test("Should throw if sign throws", async () => {
		const systemUnderTest = makeSystemUnderTest();

		jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
			throw new Error();
		});

		expect(
			systemUnderTest.encrypt("validId")
		).rejects.toThrow();
	});
});