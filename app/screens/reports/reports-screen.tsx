import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Header, Report, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { FlatGrid } from "react-native-super-grid"
import { castToSnapshot } from "mobx-state-tree"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const NO_REPORTS_MESSAGE: TextStyle = {
  paddingHorizontal: spacing[4],
}

export const ReportsScreen: FC<StackScreenProps<NavigatorParamList, "reports">> = observer(
  function ReportsScreen({ navigation }) {
    // Pull in one of our MST stores
    const { reportStore } = useStores()
    const { reports } = reportStore

    return (
      <Screen testID="ReportScreen" style={ROOT} preset="fixed">
        <Header headerTx="mainMenuScreen.reports" leftIcon="back" />
        {reports.length ? (
          <FlatGrid
            itemDimension={64}
            spacing={spacing[4]}
            data={castToSnapshot(reports)}
            renderItem={({ item }) => (
              <Report
                onPress={() => navigation.navigate("report", { id: item.id })}
                key={item.id}
                report={castToSnapshot(item)}
              />
            )}
          />
        ) : (
          <Text style={NO_REPORTS_MESSAGE} testID="NoReportsMessage" tx="reportScreen.noReports" />
        )}
      </Screen>
    )
  },
)
