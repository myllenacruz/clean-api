import { IHasher } from "@data/protocols/cryptography/hash/IHasher";
import bcrypt from "bcrypt";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";

export class BCryptAdapter implements IHasher, IHashComparer {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	public async hash(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);
		return hashedValue;
	}

	public async compare(
		value: string,
		hash: string
	): Promise<boolean> {
		await bcrypt.compare(value, hash);
		return true;
	}
}