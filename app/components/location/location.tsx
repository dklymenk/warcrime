import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { formatDistance } from "date-fns"
import { uk } from "date-fns/locale"
import differenceInMinutes from "date-fns/differenceInMinutes"
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

const SMALL_TEXT: TextStyle = {
  color: color.palette.offWhite,
  fontSize: 12,
  lineHeight: 12,
  textAlign: "right",
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

  const isMounted = React.useRef(false)

  const calculateDistance = React.useCallback(() => {
    if (!location.updatedAt) {
      return ""
    }

    const now = new Date()
    const then = new Date(location.updatedAt)
    const minutes = differenceInMinutes(now, then)

    if (minutes < 1) {
      return ""
    }

    const distance = formatDistance(then, now, {
      addSuffix: true,
      locale: uk,
    })

    return distance
  }, [])

  const [distance, setDistance] = React.useState(calculateDistance)

  React.useEffect(() => {
    const timer = setInterval(() => setDistance(calculateDistance()), 5 * 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted.current) {
      setDistance("")
    } else {
      isMounted.current = true
    }
  }, [location.latLong])

  return (
    <View style={styles}>
      <Text style={[TEXT, location.latLong && TEXT_FOUND]}>
        {location.latLong || translate("cameraScreen.waitingForLocation")}
      </Text>
      <Text style={SMALL_TEXT}>{distance}</Text>
    </View>
  )
})
