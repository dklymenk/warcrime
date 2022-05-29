import * as FileSystem from "expo-file-system"
import piexif from "piexifjs"
// import { PhotoFile } from "react-native-vision-camera"

export const read = async (uri: string) => {
  const image = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  })
  const res = piexif.load(`data:image/jpg;base64,${image}`)
  console.tron.debug(res)
}

// export const write = async (uri: string, exif: any) => {
//   const image = await FileSystem.readAsStringAsync(uri, {
//     encoding: "base64",
//   })
//   const res = piexif.load(`data:image/jpg;base64,${image}`)
//   const exifObj = piexif.dump(exif)
//   const newImage = piexif.insert(exifObj, res)
//   const newImageBase64 = `data:image/jpg;base64,${newImage}`
//   const newUri = await FileSystem.writeAsStringAsync(uri, newImageBase64, {
//     encoding: "base64",
//   })
//   // console.tron.debug(newUri)
//   read(uri)
// }

// export const metadataToExifObj = (metadata: PhotoFile["metadata"]) => {
//   // metadata['{Exif}'].LensModel
//   const exifObj = {
//     Exif: {
//       [piexif.ExifIFD.LensModel]: metadata["{Exif}"].LensModel,
//     },
//   }
//   console.tron.debug(exifObj)
//   return exifObj
// }
