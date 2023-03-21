import jwt from "jsonwebtoken";
import { JwtAdapter } from "@infra/cryptography/jwt/JwtAdapter";

jest.mock("jsonwebtoken", () => ({
	async sign(): Promise<string> {
		return "validToken";
	}
}));

describe("JwtAdapter", () => {
	test("Should call sign with correct values", async () => {
		const systemUnderTest = new JwtAdapter("secret");
		const signSpy = jest.spyOn(jwt, "sign");

		await systemUnderTest.encrypt("validId");

		expect(signSpy).toHaveBeenCalledWith({ id: "validId" }, "secret");
	});

	test("Should return a token on sign success", async () => {
		const systemUnderTest = new JwtAdapter("secret");
		const accessToken = await systemUnderTest.encrypt("validId");

		expect(accessToken).toBe("validToken");
	});
});