import { dropsToXrp, xrpToDrops } from "xrpl"
import { ONE_MILLION } from "../constants"

type ConvertAmountProps = {
  amount: string
  to: "drops" | "xrp"
}

export const convertAmount = ({ amount, to }: ConvertAmountProps) => {
  if (to === "drops") {
    try {
      return xrpToDrops(amount)
    } catch {
      return (+amount * ONE_MILLION).toString()
    }
  } else {
    try {
      return dropsToXrp(amount)
    } catch {
      return (+amount / ONE_MILLION).toString()
    }
  }
}
