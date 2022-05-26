import * as FileSystem from "expo-file-system"
import piexif from "piexifjs"

export const read = async (uri: string) => {
  const image = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  })
  const res = piexif.load(`data:image/jpg;base64,${image}`)
  return res
}
