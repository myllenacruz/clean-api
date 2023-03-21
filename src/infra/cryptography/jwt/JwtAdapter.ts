import { IEncrypter } from "@data/protocols/cryptography/token/IEncrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements IEncrypter{
	private readonly secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	public async encrypt(value: string): Promise<string> {
		jwt.sign({ id: value }, this.secret);
		return "";
	}
}