import React from "react"
import Toast, { BaseToastProps, InfoToast } from "react-native-toast-message"
import { translate, TxKeyPath } from "../../i18n"
import { color } from "../../theme"

export const toast = (tx: TxKeyPath): void => {
  Toast.show({
    type: "info",
    text1: translate(tx),
    visibilityTime: 1800,
  })
}

export const toastConfig = {
  info: function CustomInfoToast(props: BaseToastProps): JSX.Element {
    return (
      <InfoToast
        style={{
          backgroundColor: color.palette.lighterGrey,
          borderLeftColor: color.palette.deepPurple,
        }}
        text1Style={{ color: color.palette.black }}
        {...props}
      />
    )
  },
}
