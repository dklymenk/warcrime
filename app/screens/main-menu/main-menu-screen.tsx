import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Header, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"

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
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

export const MainMenuScreen: FC<StackScreenProps<NavigatorParamList, "mainMenu">> = observer(
  function MainMenuScreen({ navigation }) {
    const goBack = () => navigation.goBack()
    return (
      <Screen style={ROOT} preset="scroll">
        <Header
          headerTx="mainMenuScreen.mainMenu"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
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
          // onPress={nextScreen}
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
