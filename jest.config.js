module.exports = {
  testEnvironment: 'miniflare',
  testMatch: ['**/tests/**/*.+(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'esbuild-jest',
  },
}
