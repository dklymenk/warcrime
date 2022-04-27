import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const ReportsScreen: FC<StackScreenProps<NavigatorParamList, "reports">> = observer(
  function ReportsScreen() {
    // Pull in one of our MST stores
    const { reportStore } = useStores()
    const { reports } = reportStore

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={ROOT} preset="scroll">
        <Text preset="header" text="reports" />
        {reports.map((report) => (
          <View key={report.id}>
            <Image
              style={{ width: 100, height: 100 }}
              key={report.id}
              source={{ uri: `file://${report.photo}` }}
            />
            <Text>{report.status}</Text>
          </View>
        ))}
      </Screen>
    )
  },
)
