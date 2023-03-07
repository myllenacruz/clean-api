import { IEncrypter } from "@data/protocols/encrypter/IEncrypter";
import bcrypt from "bcrypt";

export class BCryptAdapter implements IEncrypter {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	public async encrypt(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);
		return hashedValue;
	}
}