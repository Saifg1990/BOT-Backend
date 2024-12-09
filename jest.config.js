module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
};