import { LocationModel } from "./location"

beforeAll(() => {
  jest.useFakeTimers("modern")
})
afterAll(() => {
  jest.useFakeTimers()
})

test("can be created", () => {
  const instance = LocationModel.create({})

  expect(instance).toBeTruthy()
})

test("can be created with default values", () => {
  const instance = LocationModel.create({})

  expect(instance.latLong).toBe("")
  expect(instance.updatedAt).toBe("")
})

test("can be created with custom values", () => {
  const instance = LocationModel.create({
    latLong: "test",
    updatedAt: "test",
  })

  expect(instance.latLong).toBe("test")
  expect(instance.updatedAt).toBe("test")
})

test("can be updated with custom values", () => {
  const instance = LocationModel.create({
    latLong: "test",
    updatedAt: "test",
  })

  jest.setSystemTime(1000)

  instance.update({
    latLong: "test2",
  })

  expect(instance.latLong).toBe("test2")
  expect(instance.updatedAt).toBe("1970-01-01T00:00:01.000Z")
})

test("does not get updated if the latLaong is not changed", () => {
  const instance = LocationModel.create({
    latLong: "test",
    updatedAt: "test",
  })

  instance.update({
    latLong: "test",
  })

  expect(instance.latLong).toBe("test")
  expect(instance.updatedAt).toBe("test")
})
