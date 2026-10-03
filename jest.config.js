module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle CSS imports (if you import CSS in components)
    "\.(css|less|scss|sass)$": "<rootDir>/src/test/styleMock.js",
  },
  transform: {
    "^.+\.(ts|tsx)$": ["ts-jest", { tsconfig: { jsx: "react-jsx" }, diagnostics: false }],
  },
};
