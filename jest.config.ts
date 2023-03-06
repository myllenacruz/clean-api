import { pathsToModuleNameMapper } from "ts-jest";

export default {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	moduleNameMapper: pathsToModuleNameMapper(
		{
			"@presentation/*": ["presentation/*"]
		},
		{ prefix: "<rootDir>/src/" }
	),
	collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"<rootDir>/src/presentation/protocols/*",
		"<rootDir>/src/presentation/errors/*",
		"<rootDir>/src/presentation/helpers/*",
		"<rootDir>/src/domain/models/account/interfaces",
		"<rootDir>/src/domain/useCases/account/interfaces"
	],
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts"]
};