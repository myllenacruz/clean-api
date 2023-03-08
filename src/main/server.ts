import app from "./config/app";
import { MongoHelper } from "../infra/database/mongoDb/helpers/MongoHelper";
import env from "./config/env";

async function connect(): Promise<void> {
	try {
		await MongoHelper.connect(env.mongoUrl);

		app.listen(env.port, () => {
		  console.info(`Server is running on port ${env.port}`);
		});
	} catch (err) {
		console.error(err);
	}
}

connect();