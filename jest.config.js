const nextJest = require('next/jest')

// Create Jest config for Next.js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    // Handle module aliases (same as in tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// Export the Jest config
module.exports = createJestConfig(customJestConfig)
