jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('mobx-react-lite', () => ({
  ...jest.requireActual('mobx-react-lite'),
  observer: (component) => component,
}));

