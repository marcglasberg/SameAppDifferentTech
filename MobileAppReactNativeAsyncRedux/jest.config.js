// Only the modules added here will be transformed, inside directory node_modules.
const packagesToTransformWithBabel = [
  '@react-native',
  'react-native',
  'react-native-vector-icons',
];

const transformIgnorePatterns = [
  `<rootDir>/node_modules/(?!(${packagesToTransformWithBabel.join('|')})/)`,
];

module.exports = {
  preset: 'react-native',
  // testRunner: 'jest-jasmine2',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: transformIgnorePatterns,
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/', '/fixture/', '/.*\\.fixture\\.ts$/'],
};
