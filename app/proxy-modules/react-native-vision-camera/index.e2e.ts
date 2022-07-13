import RNFS, { writeFile } from "react-native-fs"
import {
  useCameraDevices as useVisionCameraDevices,
  Camera as VisionCamera,
  CameraPermissionStatus,
  CameraPermissionRequestResult,
  CameraVideoCodec,
  VideoFileType,
  RecordVideoOptions,
  VideoFile,
} from "react-native-vision-camera"
import { imageDataBase64, videoDataBase64 } from "./assets"

type FunctionType<F> = F extends (...args: infer A) => infer R ? (...args: A) => R : never

export class Camera extends VisionCamera {
  recordingFinishedHander: (video: VideoFile) => void

  static async getCameraPermissionStatus(): Promise<CameraPermissionStatus> {
    return "authorized"
  }

  static async requestCameraPermission(): Promise<CameraPermissionRequestResult> {
    return "authorized"
  }

  static async getMicrophonePermissionStatus(): Promise<CameraPermissionStatus> {
    return "authorized"
  }

  static async requestMicrophonePermissionStatus(): Promise<CameraPermissionRequestResult> {
    return "authorized"
  }

  async getAvailableVideoCodecs(_fileType?: VideoFileType): Promise<CameraVideoCodec[]> {
    return ["h264"]
  }

  startRecording(options: RecordVideoOptions): void {
    this.recordingFinishedHander = options.onRecordingFinished
  }

  async stopRecording(): Promise<void> {
    const writePath = `${RNFS.TemporaryDirectoryPath}/simulated_camera_video.jpg`

    await writeFile(writePath, videoDataBase64, "base64")
    this.recordingFinishedHander({
      path: writePath,
      duration: 10,
    })
  }

  async takePhoto() {
    const writePath = `${RNFS.TemporaryDirectoryPath}/simulated_camera_photo.jpg`

    await writeFile(writePath, imageDataBase64, "base64")
    return {
      path: writePath,
      width: 1,
      height: 1,
      isRawPhoto: false,
      metadata: {
        Orientation: 1,
        DPIHeight: 1,
        DPIWidth: 1,
        "{TIFF}": {
          ResolutionUnit: 1,
          Software: "iOS",
          Make: "Apple",
          DateTime: "2020-01-01T00:00:00.000Z",
          XResolution: 1,
          Model: "iPhone X",
          YResolution: 1,
        },
        "{Exif}": {
          DateTimeOriginal: "2020-01-01T00:00:00.000Z",
          ExposureTime: 1,
          FNumber: 1,
          LensSpecification: [1],
          ExposureBiasValue: 1,
          ColorSpace: 1,
          FocalLenIn35mmFilm: 1,
          BrightnessValue: 1,
          ExposureMode: 1,
          LensModel: "iPhone X",
          SceneType: 1,
          PixelXDimension: 1,
          ShutterSpeedValue: 1,
          SensingMethod: 1,
          SubjectArea: [1],
          ApertureValue: 1,
          SubsecTimeDigitized: "00",
          FocalLength: 1,
          LensMake: "Apple",
          SubsecTimeOriginal: "00",
          OffsetTimeDigitized: "00",
          PixelYDimension: 1,
          ISOSpeedRatings: [1],
          WhiteBalance: 1,
          DateTimeDigitized: "2020-01-01T00:00:00.000Z",
          OffsetTimeOriginal: "00",
          ExifVersion: "0220",
          OffsetTime: "00",
          Flash: 1,
          ExposureProgram: 1,
          MeteringMode: 1,
        },
      },
    }
  }

  render() {
    return null
  }
}

export const useCameraDevices: FunctionType<typeof useVisionCameraDevices> = () => ({
  back: {
    id: "back",
    position: "back",
    name: "Back",
    hasFlash: false,
    hasTorch: false,
    isMultiCam: false,
    minZoom: 1,
    maxZoom: 128,
    neutralZoom: 1,
    supportsParallelVideoProcessing: false,
    supportsLowLightBoost: false,
    supportsDepthCapture: false,
    supportsRawCapture: false,
    supportsFocus: false,
    formats: [],
    devices: ["wide-angle-camera"],
  },
  front: undefined,
  unspecified: undefined,
  external: undefined,
})
