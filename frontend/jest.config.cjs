/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    // react-quill-new and its deps (quill, lodash-es, parchment, quill-delta)
    // ship ESM-only JS — transpile them the same way as our own TS instead of
    // treating them as pre-built CommonJS like most node_modules packages.
    "^.+\\.jsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
          module: "commonjs",
          target: "es2020",
        },
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(react-quill-new|quill|quill-delta|parchment|lodash-es|eventemitter3)/)"],
}
