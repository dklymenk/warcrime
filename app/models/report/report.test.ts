import { ReportModel } from "./report"

test("can be created", () => {
  const instance = ReportModel.create({ id: "uuid", photo: "path" })

  expect(instance).toBeTruthy()
})
