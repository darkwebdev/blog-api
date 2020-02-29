module.exports = {
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testRegex": ".*(spec)\\.(ts)$",
  "globals": {
    "ts-jest": {
      "diagnostics": false
    }
  },
  "modulePaths": [
    "<rootDir>",
    "<rootDir>/src"
  ],
  "moduleFileExtensions": [
    "ts",
    "js",
    "json"
  ]
};
