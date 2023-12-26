module.exports = {
  presets: [
    "module:@react-native/babel-preset",
    ["@babel/preset-typescript", { allowDeclareFields: true }],
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
