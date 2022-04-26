import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { color } from "../../theme"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const FULL: ViewStyle = { flex: 1 }

export const CameraScreen: FC<StackScreenProps<NavigatorParamList, "camera">> = observer(
  function CameraScreen() {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>()
    const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>()

    useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermission)
      Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
    }, [])

    const requestMicrophonePermission = useCallback(async () => {
      console.log("Requesting microphone permission...")
      const permission = await Camera.requestMicrophonePermission()
      console.log(`Microphone permission status: ${permission}`)

      if (permission === "denied") await Linking.openSettings()
      setMicrophonePermission(permission)
    }, [])

    const requestCameraPermission = useCallback(async () => {
      console.log("Requesting camera permission...")
      const permission = await Camera.requestCameraPermission()
      console.log(`Camera permission status: ${permission}`)

      if (permission === "denied") await Linking.openSettings()
      setCameraPermission(permission)
    }, [])

    const devices = useCameraDevices()
    const device = devices.back
    return (
      <Screen style={ROOT} preset="scroll">
        <Text preset="header" text="camera" />
        {cameraPermission && cameraPermission !== "authorized" && (
          <Text>
            Vision Camera needs <Text>Camera permission</Text>.
            <Text onPress={requestCameraPermission}>Grant</Text>
          </Text>
        )}
        {microphonePermission && microphonePermission !== "authorized" && (
          <Text>
            Vision Camera needs <Text>Microphone permission</Text>.
            <Text onPress={requestMicrophonePermission}>Grant</Text>
          </Text>
        )}

        {cameraPermission === "authorized" && microphonePermission === "authorized" && device && (
          <Camera style={FULL} device={device} isActive={true} />
        )}
      </Screen>
    )
  },
)
