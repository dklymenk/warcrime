import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, ImageStyle, TextStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
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
const TEXT_FIELD_INPUT: ViewStyle = {
  maxHeight: 120,
}

export const ReportScreen: FC<StackScreenProps<NavigatorParamList, "report">> = observer(
  function ReportScreen({ route }) {
    const {
      params: { id },
    } = route

    const { reportStore } = useStores()
    const report = reportStore.reports.find((report) => report.id === id)

    return (
      <Screen style={ROOT} preset="scroll">
        <Image resizeMode="contain" style={PHOTO} source={{ uri: `file://${report.photo}` }} />
        {report.latLong && <Text style={POSITION}>{report.latLong}</Text>}
        <TextField
          labelTx="reportScreen.descriptionLabel"
          inputStyle={TEXT_FIELD_INPUT}
          multiline
          value={report.description}
          scrollEnabled
          placeholderTx="reportScreen.descriptionPlaceholder"
          onChangeText={(v) => report.setDescription(v)}
        />
      </Screen>
    )
  },
)
