import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions"
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
import { toast } from "../../utils/toast"
import { Platform } from "expo-modules-core"
import * as FileSystem from "expo-file-system"
import CameraRoll from "@react-native-community/cameraroll"

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

type ValueOf<T> = T[keyof T]

export const CameraScreen: FC<StackScreenProps<NavigatorParamList, "camera">> = observer(
  function CameraScreen() {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>()
    // const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>()
    const [locationPermission, setLocationPermission] = useState<ValueOf<typeof RESULTS>>()
    const [galleryWritePermission, setGalleryWritePermission] = useState<ValueOf<typeof RESULTS>>()
    const [position, setPosition] = useState<Geolocation.GeoPosition>()

    useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermission)
      // Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
      check(
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ).then((r) => {
        setLocationPermission(r)
      })

      check(
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      ).then((r) => {
        setGalleryWritePermission(r)
      })
    }, [])

    // const requestMicrophonePermission = useCallback(async () => {
    //   // console.log("Requesting microphone permission...")
    //   const permission = await Camera.requestMicrophonePermission()
    //   // console.log(`Microphone permission status: ${permission}`)

    //   if (permission === "denied") await Linking.openSettings()
    //   setMicrophonePermission(permission)
    // }, [])

    const requestCameraPermission = useCallback(async () => {
      // console.log("Requesting camera permission...")
      const permission = await Camera.requestCameraPermission()
      // console.log(`Camera permission status: ${permission}`)

      if (permission === "denied") await Linking.openSettings()
      setCameraPermission(permission)
    }, [])

    const requestLocationPermission = useCallback(async () => {
      // console.log("Requesting location permission...")
      const result = await request(
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      )
      // console.log(`Location permission status: ${permission}`)

      if (result !== RESULTS.GRANTED) await Linking.openSettings()
      setLocationPermission(result)
    }, [])

    const requestGalleryWritePermission = useCallback(async () => {
      // console.log("Requesting location permission...")
      const result = await request(
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      )
      // console.log(`Location permission status: ${permission}`)

      if (result !== RESULTS.GRANTED) await Linking.openSettings()
      setGalleryWritePermission(result)
    }, [])

    useEffect(() => {
      if (locationPermission !== RESULTS.GRANTED) {
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
      const id = uuidv4()
      const uri = `${FileSystem.documentDirectory}${id}.jpg`

      await FileSystem.copyAsync({
        from: `file://${photo.path}`,
        to: uri,
      })
      reportStore.addReport({
        id,
        photo: `${id}.jpg`,
        status: ReportStatus.Pending,
        latLong: position ? `${position.coords.latitude},${position.coords.longitude}` : null,
      })
      toast("cameraScreen.photoTaken")
      CameraRoll.save(photo.path)
    }

    const orientation = useOrientation()

    return (
      <Screen style={ROOT} preset="scroll">
        {cameraPermission === "authorized" &&
        // microphonePermission === "authorized" &&
        galleryWritePermission === RESULTS.GRANTED &&
        locationPermission === RESULTS.GRANTED &&
        device ? (
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
        ) : (
          <Header leftIcon="back" headerTx="mainMenuScreen.camera" />
        )}
        {cameraPermission && cameraPermission !== "authorized" && (
          <>
            <Text tx={"cameraScreen.cameraPermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestCameraPermission} />
          </>
        )}
        {/* {microphonePermission && microphonePermission !== "authorized" && ( */}
        {/*   <> */}
        {/*     <Text tx={"cameraScreen.microphonePermissionRequired"} /> */}
        {/*     <Button tx={"cameraScreen.grant"} onPress={requestMicrophonePermission} /> */}
        {/*   </> */}
        {/* )} */}
        {locationPermission && locationPermission !== RESULTS.GRANTED && (
          <>
            <Text tx={"cameraScreen.locationPermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestLocationPermission} />
          </>
        )}
        {galleryWritePermission && galleryWritePermission !== RESULTS.GRANTED && (
          <>
            <Text tx={"cameraScreen.galleryWritePermissionRequired"} />
            <Button tx={"cameraScreen.grant"} onPress={requestGalleryWritePermission} />
          </>
        )}
      </Screen>
    )
  },
)
