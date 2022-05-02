import { ToastAndroid } from "react-native"
import { translate, TxKeyPath } from "../../i18n"

export default (tx: TxKeyPath): void => {
  ToastAndroid.showWithGravity(translate(tx), ToastAndroid.SHORT, ToastAndroid.CENTER)
}
