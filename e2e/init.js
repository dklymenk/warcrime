import { init, device, cleanup } from "detox"
import { detox as config } from "../package.json"
import adapter from "detox/runners/jest/adapter"

jest.setTimeout(120000)
jasmine.getEnv().addReporter(adapter)

beforeAll(async () => {
  await init(config, { initGlobals: false })
  await device.launchApp()
})

beforeEach(async () => {
  await adapter.beforeEach()
})

afterAll(async () => {
  await adapter.afterAll()
  await cleanup()
})
