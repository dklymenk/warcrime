// For more info on how to write Detox tests, see the official docs:
// https://github.com/wix/Detox/blob/master/docs/README.md

import { reloadApp } from "./reload"

describe("Example", () => {
  beforeEach(async () => {
    await reloadApp()
  })

  it("should have welcome screen", async () => {
    await expect(element(by.id("WelcomeScreen"))).toBeVisible()
  })

  it("should go to main menu screen after tap", async () => {
    await element(by.id("next-screen-button")).tap()
    await expect(element(by.id("MainMenuScreen"))).toBeVisible()
  })

  it("should go to reports screen after tap", async () => {
    await element(by.id("reports")).tap()
    await expect(element(by.id("ReportScreen"))).toBeVisible()
  })

  it("should have no reports", async () => {
    await expect(element(by.id("NoReportsMessage"))).toBeVisible()
  })

  it("should return to main menu after pressing the back button", async () => {
    await element(by.id("BackArrow")).tap()
    await expect(element(by.id("MainMenuScreen"))).toBeVisible()
  })
})
