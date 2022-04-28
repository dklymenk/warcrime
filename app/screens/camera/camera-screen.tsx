import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Screen, Text } from "../../components"
import { color } from "../../theme"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import { ReportStatus, useStores } from "../../models"
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const FULL: ViewStyle = { flex: 1 }
const CAMERA_CONTAINER: ViewStyle = { flex: 1 }
const BUTTON: ViewStyle = {
  position: "absolute",
  width: 64,
  height: 64,
  borderRadius: 50,
  bottom: 8,
  alignSelf: "center",
}

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

    const { reportStore } = useStores()

    const camera = useRef<Camera>(null)
    const takePicture = async () => {
      const photo = await camera.current.takePhoto({
        flash: "on",
      })

      reportStore.addReport({
        id: uuidv4(),
        photo: photo.path,
        status: ReportStatus.Pending,
      })
    }

    return (
      <Screen style={ROOT} preset="scroll">
        <Text preset="header" text="camera" />
        {cameraPermission && cameraPermission !== "authorized" && (
          <>
            <Text tx={"cameraScreen.cameraPermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestCameraPermission} />
          </>
        )}
        {microphonePermission && microphonePermission !== "authorized" && (
          <>
            <Text tx={"cameraScreen.microphonePermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestMicrophonePermission} />
          </>
        )}

        {cameraPermission === "authorized" && microphonePermission === "authorized" && device && (
          <View style={CAMERA_CONTAINER}>
            <Camera ref={camera} style={FULL} device={device} isActive={true} photo={true} />
            <Button style={BUTTON} onPress={takePicture} />
          </View>
        )}
      </Screen>
    )
  },
)
