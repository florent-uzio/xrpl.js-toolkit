import { isObject, isUndefined } from "./typeof-fns"

type replacementFn = (key: string, value: any) => string

function deepReplace(o: any, key: string, replacement: replacementFn): any {
  if (Array.isArray(o)) {
    // handle array first, because array is an object too
    const result = []
    for (const item of o) {
      result.push(deepReplace(item, key, replacement))
    }
    return result
  } else if (isObject(o) && !isUndefined(o)) {
    // handle object
    let result: any = {}
    for (const prop in o) {
      if (prop === key) {
        const replacementStr = replacement(key, o[prop])
        result = { ...result, [key]: replacementStr }
      } else {
        result[prop] = deepReplace(o[prop], key, replacement)
      }
    }
    return result
  }
  return o
}

export { deepReplace }
