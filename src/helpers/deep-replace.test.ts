import { describe, expect, test } from "@jest/globals"
import { AMMCreate, TrustSet } from "xrpl"
import { convertCurrencyCodeToHex } from "./currency-code.helpers"
import { deepReplace } from "./deep-replace"

describe("One level object", () => {
  test("it does not change the currency if it has 3 characters", () => {
    const object = {
      name: "Paul",
      currency: "ABC",
    }

    const result = deepReplace(object, "currency", (_, value) => {
      return convertCurrencyCodeToHex(value)
    })

    expect(result).toEqual(object)
  })

  test("it does change the currency if it has more than 3 characters", () => {
    const object = {
      name: "Paul",
      currency: "ABCD",
    }

    const hexCurrency = convertCurrencyCodeToHex(object.currency)

    const result = deepReplace(object, "currency", (_, value) => {
      return convertCurrencyCodeToHex(value)
    })

    expect(result.currency).toEqual(hexCurrency)
    expect(result.name).toEqual(object.name)
  })
})

describe("Nested object", () => {
  test("It changes the currency for a Trustset where currency has more than 3 characters", () => {
    const trustset: TrustSet = {
      Account: "r124",
      TransactionType: "TrustSet",
      LimitAmount: {
        currency: "ABCD",
        value: "100",
        issuer: "r111",
      },
    }

    const result = deepReplace(trustset, "currency", (_, value) => {
      return convertCurrencyCodeToHex(value)
    })

    const expected = {
      ...trustset,
      LimitAmount: {
        ...trustset.LimitAmount,
        currency: convertCurrencyCodeToHex(trustset.LimitAmount.currency),
      },
    }

    expect(result).toEqual(expected)
  })

  test("It changes the currency for an AMMCreate where currency has more than 3 characters", () => {
    const ammCreate: AMMCreate = {
      Account: "r124",
      TransactionType: "AMMCreate",
      Amount: {
        currency: "ABCD",
        issuer: "r123",
        value: "100",
      },
      Amount2: {
        currency: "ZXCV",
        issuer: "r987",
        value: "1000",
      },
      TradingFee: 0,
    }

    const result = deepReplace(ammCreate, "currency", (_, value) => {
      return convertCurrencyCodeToHex(value)
    })

    const expected = {
      ...ammCreate,
      Amount: {
        // @ts-expect-error Will work as Amount is an object and not a string
        ...ammCreate.Amount,
        // @ts-expect-error Will work as Amount is an object and not a string
        currency: convertCurrencyCodeToHex(ammCreate.Amount.currency),
      },
      Amount2: {
        // @ts-expect-error Will work as Amount is an object and not a string
        ...ammCreate.Amount2,
        // @ts-expect-error Will work as Amount is an object and not a string
        currency: convertCurrencyCodeToHex(ammCreate.Amount2.currency),
      },
    }

    expect(result).toEqual(expected)
  })
})
