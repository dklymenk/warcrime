import * as React from "react"
import {
  StyleProp,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  Pressable,
  GestureResponderEvent,
} from "react-native"
import { observer } from "mobx-react-lite"
import { ReportSnapshot, ReportStatus } from "../../models"
import { color, spacing } from "../../theme"

const CONTAINER: ViewStyle = {
  width: 64,
  height: 64,
  justifyContent: "center",
  margin: spacing[2],
}

const IMAGE: ImageStyle = {
  width: 64,
  height: 64,
  borderRadius: 8,
}
const STATUS_COLORS: Record<ReportStatus, string> = {
  UPLOADED: color.palette.offWhite,
  PENDING: color.palette.orange,
  ACCEPTED: color.palette.deepPurple,
  REJECTED: color.palette.angry,
}
const STATUS_CIRCLE = (status: ReportStatus): ViewStyle => ({
  position: "absolute",
  bottom: 4,
  right: 4,
  width: 12,
  height: 12,
  borderRadius: 50,
  borderColor: color.palette.black,
  borderWidth: 1,
  backgroundColor: STATUS_COLORS[status],
})

export interface ReportProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  report: ReportSnapshot
  onPress?: (event: GestureResponderEvent) => void
}

/**
 * Describe your component here
 */
export const Report = observer(function Report(props: ReportProps) {
  const { style, report, onPress } = props
  const styles = Object.assign({}, CONTAINER, style)

  const source = report.photo.indexOf("data/user")
    ? { uri: `file://${report.photo}` }
    : { uri: report.photo }

  return (
    <Pressable onPress={onPress} style={styles}>
      <Image style={IMAGE} key={report.id} source={source} />
      <View style={STATUS_CIRCLE(report.status)} />
    </Pressable>
  )
})
