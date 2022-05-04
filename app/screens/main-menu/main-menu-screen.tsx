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

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  paddingHorizontal: spacing[4],
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
  alignItems: "flex-start",
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
        const result = await launchImageLibrary({ mediaType: "photo" })
        reportStore.addReport({
          photo: result.assets[0].uri,
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
          testID="camera"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.camera"
          onPress={() => navigation.navigate("camera")}
        />
        <Button
          testID="gallery"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.gallery"
          onPress={onGalleryPress}
        />
        <Button
          testID="camera"
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          tx="mainMenuScreen.reports"
          onPress={() => navigation.navigate("reports")}
        />
      </Screen>
    )
  },
)
