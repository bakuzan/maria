module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['dist/', '__tests__/__helpers'],
  coveragePathIgnorePatterns: ['dist/', '__tests__/__helpers'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['<rootDir>', 'src', 'node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/', 'dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  collectCoverageFrom: ['./src/**/*.ts'],
  testPathIgnorePatterns: ['\\.d\\.ts$']
};
