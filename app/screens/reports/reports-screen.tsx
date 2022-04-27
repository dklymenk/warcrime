import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Report, Screen, Text } from "../../components"
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
          <Report key={report.id} report={report} />
        ))}
      </Screen>
    )
  },
)
