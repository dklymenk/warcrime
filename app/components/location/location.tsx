import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Text } from "../text/text"
import { LocationSnapshot } from "../../models/location/location"
import { translate } from "../../i18n"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  color: color.palette.angry,
}

const TEXT_FOUND: TextStyle = {
  color: color.palette.offWhite,
}

export interface LocationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  location: LocationSnapshot
}

/**
 * Describe your component here
 */
export const Location = observer(function Location(props: LocationProps) {
  const { style, location } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <Text style={[TEXT, location.latLong && TEXT_FOUND]}>
        {location.latLong || translate("cameraScreen.waitingForLocation")}
      </Text>
    </View>
  )
})
