jest.mock("react-native-fs", () => {
  const RNFS = {
    DocumentDirectoryPath: "test/",
  }

  return RNFS
})
