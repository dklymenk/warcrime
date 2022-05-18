import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Header, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { launchImageLibrary } from "react-native-image-picker"
import { useStores } from "../../models"
import { toast } from "../../utils/toast"
import * as FileSystem from "expo-file-system"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  // paddingHorizontal: spacing[4],
  flex: 1,
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  margin: spacing[4],
  backgroundColor: color.palette.deepPurple,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}

export const MainMenuScreen: FC<StackScreenProps<NavigatorParamList, "mainMenu">> = observer(
  function MainMenuScreen({ navigation }) {
    const { reportStore } = useStores()

    const onGalleryPress = async () => {
      try {
        const result = await launchImageLibrary({ mediaType: "mixed" })
        if (result.assets.length === 0) {
          return
        }

        const asset = result.assets[0]

        // TODO https://github.com/react-native-image-picker/react-native-image-picker/issues/1959
        let fileName = asset.fileName
        if (asset.type.includes("video") && !fileName.includes(".")) {
          const extension = asset.type.slice(asset.type.indexOf("/") + 1)
          fileName = `${fileName}.${extension}`
        }

        const uri = `${FileSystem.documentDirectory}${fileName}`
        await FileSystem.copyAsync({
          from: asset.uri,
          to: uri,
        })

        reportStore.addReport({
          photo: fileName,
        })
        toast("mainMenuScreen.loadedFromGallery")
      } catch (error) {
        console.tron.error(error.message, null)
      }
    }
    return (
      <Screen testID="MainMenuScreen" style={ROOT} preset="scroll">
        <Header headerTx="mainMenuScreen.mainMenu" leftIcon="back" />
        <Button
          testID="CameraButton"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.camera"
          onPress={() => navigation.navigate("camera")}
        />
        <Button
          testID="GalleryButton"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.gallery"
          onPress={onGalleryPress}
        />
        <Button
          testID="ReportsButton"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.reports"
          onPress={() => navigation.navigate("reports")}
        />
      </Screen>
    )
  },
)
