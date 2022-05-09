// For more info on how to write Detox tests, see the official docs:
// https://github.com/wix/Detox/blob/master/docs/README.md

import { by, expect, element, device } from "detox"

describe("Reports", () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true })
  })

  it("do not exist initially", async () => {
    await element(by.id("ContinueAnonymouslyButton")).tap()
    await element(by.id("ReportsButton")).tap()
    await expect(element(by.id("NoReportsMessage"))).toBeVisible()
  })

  it("can be created from gallery", async () => {
    await element(by.id("ContinueAnonymouslyButton")).tap()
    // TODO
    // await element(by.id("gallery")).tap()
    await element(by.id("ReportsButton")).tap()
    // await expect(element(by.id("NoReportsMessage"))).not.toBeVisible()
  })
})
