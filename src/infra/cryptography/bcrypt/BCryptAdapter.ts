import { IHasher } from "@data/protocols/cryptography/hash/IHasher";
import bcrypt from "bcrypt";

export class BCryptAdapter implements IHasher {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	public async hash(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);
		return hashedValue;
	}
}