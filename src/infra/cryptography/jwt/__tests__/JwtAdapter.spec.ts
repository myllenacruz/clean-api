import jwt from "jsonwebtoken";
import { JwtAdapter } from "@infra/cryptography/jwt/JwtAdapter";

describe("JwtAdapter", () => {
	test("Should call sign with correct values", async () => {
		const systemUnderTest = new JwtAdapter("secret");
		const signSpy = jest.spyOn(jwt, "sign");

		await systemUnderTest.encrypt("validId");

		expect(signSpy).toHaveBeenCalledWith({ id: "validId" }, "secret");
	});
});