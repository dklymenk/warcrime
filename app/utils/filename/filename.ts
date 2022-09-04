import { format } from "date-fns"

export function generate(extname: string): string {
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("")

  const dateTimeString = format(new Date(), "yyyy-MM-dd_HH-mm-ss")

  return `WC_${dateTimeString}_${randomName}.${extname}`
}
