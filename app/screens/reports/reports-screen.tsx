import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Header, Report, Screen } from "../../components"
import { color } from "../../theme"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
}

export const ReportsScreen: FC<StackScreenProps<NavigatorParamList, "reports">> = observer(
  function ReportsScreen({ navigation }) {
    // Pull in one of our MST stores
    const { reportStore } = useStores()
    const { reports } = reportStore

    return (
      <Screen style={ROOT} preset="scroll">
        <Header headerTx="mainMenuScreen.reports" leftIcon="back" />
        <View style={CONTAINER}>
          {reports.map((report) => (
            <Report
              onPress={() => navigation.navigate("report", { id: report.id })}
              key={report.id}
              report={report}
            />
          ))}
        </View>
      </Screen>
    )
  },
)
