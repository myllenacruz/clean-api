import { pathsToModuleNameMapper } from "ts-jest";

export default {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	moduleNameMapper: pathsToModuleNameMapper(
		{
			"@presentation/*": ["presentation/*"],
			"@utils/*": ["utils/*"],
			"@data/*": ["data/*"],
			"@infra/*": ["infra/*"],
			"@main/*": ["main/*"]
		},
		{ prefix: "<rootDir>/src/" }
	),
	collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"<rootDir>/src/presentation/protocols/*",
		"<rootDir>/src/presentation/errors/*",
		"<rootDir>/src/presentation/helpers/*",
		"<rootDir>/src/domain/models/*",
		"<rootDir>/src/domain/useCases/account/",
		"<rootDir>/src/domain/useCases/authentication/",
		"<rootDir>/src/data/protocols/*",
		"<rootDir>/src/main/server.ts",
		"<rootDir>/src/main/config/env"
	],
	preset: "@shelf/jest-mongodb",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts"],
	transform: {
		".+\\.ts$": "ts-jest"
	}
};