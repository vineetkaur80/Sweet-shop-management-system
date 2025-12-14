export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  verbose: true,
  forceExit: true,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json"
    }
  }
};
