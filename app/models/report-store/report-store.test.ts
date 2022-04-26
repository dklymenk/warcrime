import { ReportStoreModel } from "./report-store"

test("can be created", () => {
  const instance = ReportStoreModel.create({})

  expect(instance).toBeTruthy()
})
