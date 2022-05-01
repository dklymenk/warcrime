import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, ImageStyle, TextStyle, ActivityIndicator, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Header, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { ReportStatus, useStores } from "../../models"
import { TxKeyPath } from "../../i18n"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
}
const PHOTO: ImageStyle = {
  flex: 1,
  height: undefined,
  width: undefined,
}
const POSITION: TextStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  color: color.palette.offWhite,
}
const STATUS: TextStyle = {
  position: "absolute",
  top: 8,
  left: 8,
  color: color.palette.offWhite,
}
const TEXT_FIELD_INPUT: ViewStyle = {
  maxHeight: 120,
}
const LOADING_SPINNER: ViewStyle = {}
const LOADING_CONTAINER: ViewStyle = {
  position: "absolute",
  flex: 1,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0.9,
  backgroundColor: color.palette.black,
}
// const BUTTON_DISABLED: ViewStyle = {
//   backgroundColor: color.palette.lightGrey,
// }

export const ReportScreen: FC<StackScreenProps<NavigatorParamList, "report">> = observer(
  function ReportScreen({ route }) {
    const {
      params: { id },
    } = route

    const { reportStore } = useStores()
    const report = reportStore.reports.find((report) => report.id === id)

    return (
      <Screen style={ROOT} preset="scroll">
        <Header headerTx="reportScreen.report" leftIcon="back" />
        <View style={CONTENT}>
          <Image resizeMode="contain" style={PHOTO} source={{ uri: `file://${report.photo}` }} />
          {report.latLong && <Text style={POSITION}>{report.latLong}</Text>}
          <TextField
            labelTx="reportScreen.descriptionLabel"
            inputStyle={TEXT_FIELD_INPUT}
            multiline
            value={report.description}
            editable={report.status === ReportStatus.Pending}
            scrollEnabled
            placeholderTx="reportScreen.descriptionPlaceholder"
            onChangeText={(v) => report.setDescription(v)}
          />
          {report.status === ReportStatus.Pending && (
            <Button
              tx="reportScreen.send"
              // style={!report.description && BUTTON_DISABLED}
              // disabled={!report.description}
              onPress={() => report.upload()}
            ></Button>
          )}
          {report.status !== ReportStatus.Pending && (
            <Text style={STATUS} tx={`reportScreen.status.${report.status}` as TxKeyPath} />
          )}
          {report.loading && (
            <View style={LOADING_CONTAINER}>
              <ActivityIndicator
                color={color.palette.offWhite}
                size={"large"}
                style={LOADING_SPINNER}
              />
            </View>
          )}
        </View>
      </Screen>
    )
  },
)
