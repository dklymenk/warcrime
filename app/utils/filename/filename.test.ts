import { generate } from "./filename"

describe("generate", () => {
  it("contains current datetime", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2020-01-02 03:02:01"))

    expect(generate("jpeg")).toMatch(/2020-01-02_03-02-01/)

    jest.useRealTimers()
  })

  it('starts with "WC_" prefix', () => {
    expect(generate("jpeg")).toMatch(/^WC_/)
  })

  it("should generate name that is at least 24 characters long", () => {
    const name = generate("jpeg")
    expect(name.length).toBeGreaterThanOrEqual(24)
  })

  it("should generate name with correct extension", () => {
    expect(generate("jpeg")).toMatch(/\.jpeg$/)
  })
})
