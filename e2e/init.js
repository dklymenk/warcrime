const { init, device, cleanup } = require("detox")
const config = require("../package.json").detox
const adapter = require("detox/runners/jest/adapter")

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
