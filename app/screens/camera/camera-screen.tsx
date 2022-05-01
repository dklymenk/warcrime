import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle, PermissionsAndroid, TextStyle, Dimensions } from "react-native"
import Geolocation from "react-native-geolocation-service"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Header, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import { ReportStatus, useStores } from "../../models"
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"
import { translate } from "../../i18n"
import { useOrientation } from "../../utils/useOrientation"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
  opacity: 0.5,
  position: "absolute",
  backgroundColor: color.palette.black,
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
}
const CAMERA_CONTAINER: ViewStyle = { flex: 1 }
const POSITION: TextStyle = {
  position: "absolute",
  top: 32,
  right: 8,
  color: color.palette.angry,
}
const POSITION_FOUND: TextStyle = {
  color: color.palette.offWhite,
}
const BUTTON = (orientation: "PORTRAIT" | "LANDSCAPE"): ViewStyle => ({
  position: "absolute",
  width: 64,
  height: 64,
  borderRadius: 50,
  bottom: orientation === "PORTRAIT" ? 8 : Dimensions.get("screen").height / 2 - 32,
  right: orientation === "LANDSCAPE" ? 8 : null,
  // transform: [{translateY: }],
  alignSelf: orientation === "PORTRAIT" ? "center" : "flex-end",
})

export const CameraScreen: FC<StackScreenProps<NavigatorParamList, "camera">> = observer(
  function CameraScreen() {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>()
    const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>()
    const [locationPermission, setLocationPermission] = useState<
      PermissionState | "never_ask_again"
    >()
    const [position, setPosition] = useState<Geolocation.GeoPosition>()

    useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermission)
      Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((s) =>
        setLocationPermission(
          s ? PermissionsAndroid.RESULTS.GRANTED : PermissionsAndroid.RESULTS.DENIED,
        ),
      )
    }, [])

    const requestMicrophonePermission = useCallback(async () => {
      // console.log("Requesting microphone permission...")
      const permission = await Camera.requestMicrophonePermission()
      // console.log(`Microphone permission status: ${permission}`)

      if (permission === "denied") await Linking.openSettings()
      setMicrophonePermission(permission)
    }, [])

    const requestCameraPermission = useCallback(async () => {
      // console.log("Requesting camera permission...")
      const permission = await Camera.requestCameraPermission()
      // console.log(`Camera permission status: ${permission}`)

      if (permission === "denied") await Linking.openSettings()
      setCameraPermission(permission)
    }, [])

    const requestLocationPermission = useCallback(async () => {
      // console.log("Requesting location permission...")
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      // console.log(`Location permission status: ${permission}`)

      if (permission !== PermissionsAndroid.RESULTS.GRANTED) await Linking.openSettings()
      setLocationPermission(permission)
    }, [])

    useEffect(() => {
      if (locationPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        return undefined
      }
      // console.log("Trying to get position")
      const watchId = Geolocation.watchPosition(
        (position) => {
          // console.log(position)
          setPosition(position)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message)
        },
      )
      return () => {
        // console.log("unsubscribing from location")
        Geolocation.clearWatch(watchId)
        Geolocation.stopObserving()
      }
    }, [locationPermission])

    const devices = useCameraDevices()
    const device = devices.back

    const { reportStore } = useStores()

    const camera = useRef<Camera>(null)
    const takePicture = async () => {
      const photo = await camera.current.takePhoto()

      reportStore.addReport({
        id: uuidv4(),
        photo: photo.path,
        status: ReportStatus.Pending,
        latLong: position ? `${position.coords.latitude},${position.coords.longitude}` : null,
      })
    }

    const orientation = useOrientation()

    return (
      <Screen style={ROOT} preset="scroll">
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
        {locationPermission && locationPermission !== PermissionsAndroid.RESULTS.GRANTED && (
          <>
            <Text tx={"cameraScreen.locationPermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestLocationPermission} />
          </>
        )}

        {cameraPermission === "authorized" &&
          microphonePermission === "authorized" &&
          locationPermission === PermissionsAndroid.RESULTS.GRANTED &&
          device && (
            <View style={CAMERA_CONTAINER}>
              <Camera ref={camera} style={FULL} device={device} isActive={true} photo={true} />
              <Text style={[POSITION, position && POSITION_FOUND]}>
                {position
                  ? `${position.coords.latitude}, ${position.coords.longitude}`
                  : translate("cameraScreen.waitingForLocation")}
              </Text>
              <Header style={HEADER} leftIcon="back" headerTx="mainMenuScreen.camera" />
              <Button style={BUTTON(orientation)} onPress={takePicture} />
            </View>
          )}
      </Screen>
    )
  },
)
