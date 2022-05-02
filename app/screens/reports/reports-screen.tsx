import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Header, Report, Screen } from "../../components"
import { color } from "../../theme"
import { useStores } from "../../models"
import { FlatGrid } from "react-native-super-grid"
import { castToSnapshot } from "mobx-state-tree"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const ReportsScreen: FC<StackScreenProps<NavigatorParamList, "reports">> = observer(
  function ReportsScreen({ navigation }) {
    // Pull in one of our MST stores
    const { reportStore } = useStores()
    const { reports } = reportStore

    return (
      <Screen style={ROOT} preset="fixed">
        <Header headerTx="mainMenuScreen.reports" leftIcon="back" />
        <FlatGrid
          itemDimension={80}
          data={castToSnapshot(reports)}
          renderItem={({ item }) => (
            <Report
              onPress={() => navigation.navigate("report", { id: item.id })}
              key={item.id}
              report={castToSnapshot(item)}
            />
          )}
        />
      </Screen>
    )
  },
)
