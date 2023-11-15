module.exports = {
    present: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    testTimeout: 20000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};