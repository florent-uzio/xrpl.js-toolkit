import { dropsToXrp, xrpToDrops } from "xrpl"
import { ONE_MILLION } from "../constants"

type ConvertAmountProps = {
  amount: string | number
  decimals?: number
  to: "drops" | "xrp"
}

export const convertAmount = ({ amount, to, decimals = 4 }: ConvertAmountProps) => {
  if (to === "drops") {
    try {
      return xrpToDrops(amount)
    } catch {
      return (+amount * ONE_MILLION).toFixed(decimals).toString()
    }
  } else {
    try {
      return dropsToXrp(amount)
    } catch {
      return (+amount / ONE_MILLION).toFixed(decimals).toString()
    }
  }
}
