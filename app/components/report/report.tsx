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
import { color } from "../../theme"
import * as FileSystem from "expo-file-system"

const CONTAINER: ViewStyle = {
  aspectRatio: 1,
  flex: 1,
}

const IMAGE: ImageStyle = {
  flex: 1,
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

  const source = { uri: `${FileSystem.documentDirectory}${report.photo}` }

  return (
    <Pressable onPress={onPress} style={styles}>
      <Image style={IMAGE} key={report.id} source={source} />
      <View style={STATUS_CIRCLE(report.status)} />
    </Pressable>
  )
})
