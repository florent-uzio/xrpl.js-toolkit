export const random = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 1000)
