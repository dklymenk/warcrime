// import { ToastAndroid } from "react-native"
import { translate, TxKeyPath } from "../../i18n"

// TODO
export default (tx: TxKeyPath): void => {
  // ToastAndroid.showWithGravity(translate(tx), ToastAndroid.SHORT, ToastAndroid.CENTER)
  __DEV__ && console.tron.log(translate(tx))
}
