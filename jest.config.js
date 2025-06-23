module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional setup file
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/sanity/(.*)$': '<rootDir>/src/sanity/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1', // Added this line
    // Handle CSS imports (if you import CSS in components)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  // globals section for ts-jest is deprecated, so removing it
};
